import createSupabaseClient from '../supabase/config';
import logger from '../logger';
import type { GenerationSession } from '../types';

const supabase = createSupabaseClient();

class PrometheusService {
  async queueGeneration(payload: {
    bookingId: string;
    studentEmail: string;
    universities: string[];
    metadata?: Record<string, unknown>;
  }): Promise<GenerationSession> {
    logger.info(
      {
        bookingId: payload.bookingId,
        universities: payload.universities
      },
      'Queueing Prometheus generation'
    );

    // Placeholder implementation - replace with actual queue/job dispatch
    const { data, error } = await supabase
      .from('mock_interview_sessions')
      .insert({
        booking_id: payload.bookingId,
        student_email: payload.studentEmail,
        universities: payload.universities,
        metadata: payload.metadata ?? {},
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      logger.error({ error }, 'Failed to insert session');
      throw error;
    }

    return {
      id: data.id,
      bookingId: data.booking_id,
      status: data.status,
      universities: data.universities,
      createdAt: data.created_at
    };
  }

  async getSessionById(id: string): Promise<GenerationSession | null> {
    const { data, error } = await supabase
      .from('mock_interview_sessions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error({ error }, 'Error fetching session');
      return null;
    }

    return {
      id: data.id,
      bookingId: data.booking_id,
      status: data.status,
      universities: data.universities,
      createdAt: data.created_at,
      results: data.results
    };
  }
}

const prometheusService = new PrometheusService();

export default prometheusService;
