## Prometheus Service

Node/Express microservice responsible for generating mock interview question sets and syncing them with Supabase.

### Features (planned)
- Receive booking payloads from the main backend after Stripe webhooks fire
- Queue question generation jobs per university selection
- Persist sessions/results to Supabase for tutors and students
- Provide REST APIs for tutor dashboard + frontend to fetch progress

### Development
```bash
npm install
npm run dev -w @nextgenmedprep/prometheus
```

Environment variables (`apps/prometheus/.env.example`) must be copied into `.env` before running locally.
