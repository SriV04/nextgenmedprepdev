export interface GenerationSession {
  id: string;
  bookingId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  universities: string[];
  createdAt: string;
  results?: Record<string, unknown>;
}
