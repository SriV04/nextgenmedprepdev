declare module 'cloudipsp-node-js-sdk' {
  interface CloudIpspConfig {
    merchantId: number;
    secretKey: string;
    contentType?: 'json' | 'form';
  }

  interface CheckoutRequest {
    order_id: string;
    order_desc: string;
    currency: string;
    amount: string;
    response_url?: string;
    server_callback_url?: string;
    sender_email?: string;
    product_id?: string;
    merchant_data?: string;
    lifetime?: number;
    preauth?: 'Y' | 'N';
    delayed?: 'Y' | 'N';
    lang?: 'uk' | 'ru' | 'en';
    recurring_data?: {
      every: number;
      period: 'day' | 'week' | 'month' | 'year';
      amount: number;
      start_time: string;
      state: 'y' | 'n';
      readonly: 'y' | 'n';
    };
  }

  interface CheckoutResponse {
    response_status: 'success' | 'failure';
    checkout_url?: string;
    payment_id?: string;
    order_id?: string;
    error_message?: string;
    error_code?: number;
  }

  interface StatusRequest {
    order_id: string;
  }

  interface StatusResponse {
    order_id: string;
    order_status: 'approved' | 'declined' | 'processing' | 'expired' | 'reversed';
    amount: string;
    currency: string;
    payment_system?: string;
    masked_card?: string;
    response_status: 'success' | 'failure';
  }

  interface ReverseRequest {
    order_id: string;
    currency: string;
    amount: string;
  }

  interface CaptureRequest {
    order_id: string;
    currency: string;
    amount: string;
  }

  interface ReportsRequest {
    date_from: Date;
    date_to: Date;
  }

  interface TransactionListRequest {
    order_id: string;
  }

  class CloudIpsp {
    constructor(config: CloudIpspConfig);
    
    Checkout(data: CheckoutRequest): Promise<CheckoutResponse>;
    Subscription(data: CheckoutRequest): Promise<CheckoutResponse>;
    Status(data: StatusRequest): Promise<StatusResponse>;
    Reverse(data: ReverseRequest): Promise<any>;
    Capture(data: CaptureRequest): Promise<any>;
    Reports(data: ReportsRequest): Promise<any>;
    TransactionList(data: TransactionListRequest): Promise<any>;
    PciDssOne(data: any): Promise<any>;
    PciDssTwo(data: any): Promise<any>;
    Verification(data: any): Promise<any>;
    SubscriptionActions(data: any): Promise<any>;
    
    isValidResponse(response: any): boolean;
  }

  export = CloudIpsp;
}