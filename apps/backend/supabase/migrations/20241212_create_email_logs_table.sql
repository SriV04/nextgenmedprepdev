-- Create email_logs table for tracking email delivery
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient TEXT NOT NULL,
  recipient_domain TEXT,
  subject TEXT NOT NULL,
  email_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'pending', 'bounced')),
  message_id TEXT,
  response TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on recipient for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);

-- Create index on recipient_domain for analytics
CREATE INDEX IF NOT EXISTS idx_email_logs_domain ON email_logs(recipient_domain);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- Create index on email_type for analytics
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(email_type);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER email_logs_updated_at_trigger
  BEFORE UPDATE ON email_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_email_logs_updated_at();

-- Add comments for documentation
COMMENT ON TABLE email_logs IS 'Tracks all email delivery attempts and their status';
COMMENT ON COLUMN email_logs.recipient IS 'Email address of the recipient';
COMMENT ON COLUMN email_logs.recipient_domain IS 'Domain of the recipient email (e.g., gmail.com, outlook.com)';
COMMENT ON COLUMN email_logs.subject IS 'Email subject line';
COMMENT ON COLUMN email_logs.email_type IS 'Type of email (e.g., welcome, booking_confirmation, interview_confirmation)';
COMMENT ON COLUMN email_logs.status IS 'Delivery status: sent, failed, pending, or bounced';
COMMENT ON COLUMN email_logs.message_id IS 'SMTP message ID returned by the mail server';
COMMENT ON COLUMN email_logs.response IS 'SMTP server response or rejection reason';
COMMENT ON COLUMN email_logs.error_message IS 'Error details if delivery failed';
COMMENT ON COLUMN email_logs.sent_at IS 'Timestamp when email was sent';
