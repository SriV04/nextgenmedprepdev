import CloudIpsp = require('cloudipsp-node-js-sdk');
import crypto from 'crypto';
import { 
  FondyPaymentRequest, 
  FondyPaymentResponse, 
  FondyCallbackData, 
  CreatePaymentRequest,
  PaymentStatus,
  AppError 
} from '../types';

export class FondyService {
  private fondy: any;
  private merchantId: number;
  private secretKey: string;

  constructor() {
    this.merchantId = parseInt(process.env.FONDY_MERCHANT_ID || '1396424'); // Default test merchant ID
    this.secretKey = process.env.FONDY_SECRET_KEY || 'test'; // Default test secret key
    
    if (!this.merchantId || !this.secretKey) {
      throw new AppError('Fondy credentials not configured', 500);
    }

    console.log(`FondyService initialized with Merchant ID: ${this.merchantId}`);
    this.fondy = new CloudIpsp({
      merchantId: this.merchantId,
      secretKey: this.secretKey
    });
  }

  /**
   * Create a checkout payment
   */
  async createCheckoutPayment(paymentData: CreatePaymentRequest): Promise<FondyPaymentResponse> {
    try {
      const orderId = this.generateOrderId();
      const amountInCents = (paymentData.amount * 100).toString(); // Convert to cents

      const requestData: FondyPaymentRequest = {
        order_id: orderId,
        order_desc: paymentData.description,
        currency: paymentData.currency.toUpperCase(),
        amount: amountInCents,
        sender_email: paymentData.customer_email,
        response_url: paymentData.return_url || `${process.env.FRONTEND_URL}/payment/success`,
        server_callback_url: `${process.env.BACKEND_URL}/api/v1/payments/fondy/callback`,
        lang: 'en'
      };

      const response = await this.fondy.Checkout(requestData);
      
      if (response.response_status === 'success') {
        return {
          response_status: 'success',
          checkout_url: response.checkout_url,
          payment_id: response.payment_id,
          order_id: orderId
        };
      } else {
        throw new AppError(response.error_message || 'Payment creation failed', 400);
      }
    } catch (error: any) {
      console.error('Fondy checkout error:', error);
      throw new AppError(error.message || 'Payment processing failed', 500);
    }
  }

  /**
   * Create a subscription payment
   */
  async createSubscription(
    paymentData: CreatePaymentRequest & { 
      recurring: { 
        every: number; 
        period: 'day' | 'week' | 'month' | 'year'; 
        start_time?: string;
      } 
    }
  ): Promise<FondyPaymentResponse> {
    try {
      const orderId = this.generateOrderId();
      const amountInCents = (paymentData.amount * 100).toString();

      const requestData: FondyPaymentRequest = {
        order_id: orderId,
        order_desc: paymentData.description,
        currency: paymentData.currency.toUpperCase(),
        amount: amountInCents,
        sender_email: paymentData.customer_email,
        response_url: paymentData.return_url || `${process.env.FRONTEND_URL}/payment/success`,
        server_callback_url: `${process.env.BACKEND_URL}/api/v1/payments/fondy/callback`,
        lang: 'en',
        recurring_data: {
          every: paymentData.recurring.every,
          period: paymentData.recurring.period,
          amount: parseInt(amountInCents),
          start_time: paymentData.recurring.start_time || new Date().toISOString().slice(0, 10),
          state: 'y',
          readonly: 'n'
        }
      };

      const response = await this.fondy.Subscription(requestData);
      
      if (response.response_status === 'success') {
        return {
          response_status: 'success',
          checkout_url: response.checkout_url,
          payment_id: response.payment_id,
          order_id: orderId
        };
      } else {
        throw new AppError(response.error_message || 'Subscription creation failed', 400);
      }
    } catch (error: any) {
      console.error('Fondy subscription error:', error);
      throw new AppError(error.message || 'Subscription processing failed', 500);
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(orderId: string): Promise<PaymentStatus> {
    try {
      const response = await this.fondy.Status({ order_id: orderId });
      
      return {
        order_id: response.order_id,
        status: response.order_status,
        amount: response.amount,
        currency: response.currency,
        payment_system: response.payment_system,
        masked_card: response.masked_card
      };
    } catch (error: any) {
      console.error('Fondy status error:', error);
      throw new AppError(error.message || 'Failed to get payment status', 500);
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(orderId: string, amount?: number): Promise<any> {
    try {
      // First get the payment details to know the amount and currency
      const paymentStatus = await this.getPaymentStatus(orderId);
      
      const refundData = {
        order_id: orderId,
        currency: paymentStatus.currency,
        amount: amount ? (amount * 100).toString() : paymentStatus.amount // Convert to cents if amount provided
      };

      const response = await this.fondy.Reverse(refundData);
      return response;
    } catch (error: any) {
      console.error('Fondy refund error:', error);
      throw new AppError(error.message || 'Refund processing failed', 500);
    }
  }

  /**
   * Verify callback signature
   */
  verifyCallbackSignature(callbackData: FondyCallbackData): boolean {
    try {
      const { signature, ...dataWithoutSignature } = callbackData;
      
      // Sort parameters alphabetically and create signature string
      const sortedParams = Object.keys(dataWithoutSignature)
        .sort()
        .filter(key => dataWithoutSignature[key as keyof typeof dataWithoutSignature] !== '')
        .map(key => `${dataWithoutSignature[key as keyof typeof dataWithoutSignature]}`)
        .join('|');

      const signatureString = `${this.secretKey}|${sortedParams}`;
      const expectedSignature = crypto.createHash('sha1').update(signatureString).digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  /**
   * Process callback from Fondy
   */
  async processCallback(callbackData: FondyCallbackData): Promise<{ success: boolean; message: string }> {
    try {
      // Verify signature
      if (!this.verifyCallbackSignature(callbackData)) {
        throw new AppError('Invalid callback signature', 400);
      }

      // Process based on order status
      switch (callbackData.order_status) {
        case 'approved':
          await this.handleSuccessfulPayment(callbackData);
          break;
        case 'declined':
          await this.handleFailedPayment(callbackData);
          break;
        case 'reversed':
          await this.handleReversedPayment(callbackData);
          break;
        default:
          console.log(`Payment ${callbackData.order_id} status: ${callbackData.order_status}`);
      }

      return { success: true, message: 'Callback processed successfully' };
    } catch (error: any) {
      console.error('Callback processing error:', error);
      throw new AppError(error.message || 'Callback processing failed', 500);
    }
  }

  /**
   * Handle successful payment
   */
  private async handleSuccessfulPayment(callbackData: FondyCallbackData): Promise<void> {
    console.log(`Payment approved for order ${callbackData.order_id}`);
    
    // TODO: Update database with successful payment
    // Example: Update user subscription, send confirmation email, etc.
    
    // You can add your business logic here such as:
    // - Update user subscription status
    // - Send confirmation email
    // - Grant access to premium features
    // - Log the transaction
  }

  /**
   * Handle failed payment
   */
  private async handleFailedPayment(callbackData: FondyCallbackData): Promise<void> {
    console.log(`Payment declined for order ${callbackData.order_id}: ${callbackData.response_description}`);
    
    // TODO: Handle failed payment
    // Example: Send failure notification, log for retry, etc.
  }

  /**
   * Handle reversed/refunded payment
   */
  private async handleReversedPayment(callbackData: FondyCallbackData): Promise<void> {
    console.log(`Payment reversed for order ${callbackData.order_id}`);
    
    // TODO: Handle refunded payment
    // Example: Revoke access, update subscription status, etc.
  }

  /**
   * Generate unique order ID
   */
  private generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `order_${timestamp}_${random}`;
  }

  /**
   * Validate response from Fondy
   */
  isValidResponse(response: any): boolean {
    return this.fondy.isValidResponse(response);
  }

  /**
   * Get transaction list for an order
   */
  async getTransactionList(orderId: string): Promise<any> {
    try {
      const response = await this.fondy.TransactionList({ order_id: orderId });
      return response;
    } catch (error: any) {
      console.error('Get transaction list error:', error);
      throw new AppError(error.message || 'Failed to get transaction list', 500);
    }
  }

  /**
   * Generate reports for a date range
   */
  async getReports(dateFrom: Date, dateTo: Date): Promise<any> {
    try {
      const response = await this.fondy.Reports({
        date_from: dateFrom,
        date_to: dateTo
      });
      return response;
    } catch (error: any) {
      console.error('Get reports error:', error);
      throw new AppError(error.message || 'Failed to get reports', 500);
    }
  }

  /**
   * Capture pre-authorized payment
   */
  async capturePayment(orderId: string, amount?: number): Promise<any> {
    try {
      const paymentStatus = await this.getPaymentStatus(orderId);
      
      const captureData = {
        order_id: orderId,
        currency: paymentStatus.currency,
        amount: amount ? (amount * 100).toString() : paymentStatus.amount
      };

      const response = await this.fondy.Capture(captureData);
      return response;
    } catch (error: any) {
      console.error('Fondy capture error:', error);
      throw new AppError(error.message || 'Capture processing failed', 500);
    }
  }
}

export const fondyService = new FondyService();