# Prometheus Microservice

The Prometheus service handles mock interview question generation as a standalone Node/Express application that lives in `apps/prometheus`.

## Capabilities (Initial Scaffold)
- Validates incoming booking payloads (`POST /api/v1/prometheus/generate`)
- Persists mock interview sessions to Supabase (placeholder table `mock_interview_sessions`)
- Exposes read endpoints so other services/frontends can poll session status
- Provides `/api/v1/health` for readiness checks

## Local Development
```bash
cp apps/prometheus/.env.example apps/prometheus/.env
npm install
npm run dev:prometheus
```

The service runs on port `6001` by default.

## Next Steps
1. Add a queue/worker to offload AI generation
2. Implement access control between backend API ↔ Prometheus
3. Flesh out Supabase migrations for session/question tables
4. Connect webhook flow so interview bookings automatically enqueue generation jobs
