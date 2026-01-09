import express from 'express';
import cors from 'cors';
import routes from './routes';
import env from './config/env';
import logger from './logger';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  logger.debug({ reqId: req.headers['x-request-id'] }, `${req.method} ${req.path}`);
  next();
});

app.use('/api/v1', routes);

app.get('/', (_req, res) => {
  res.json({
    name: 'NextGen MedPrep - Prometheus Service',
    status: 'online',
    env: env.NODE_ENV
  });
});

export default app;
