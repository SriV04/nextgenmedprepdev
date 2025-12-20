import app from './app';
import env from './config/env';
import logger from './logger';

const port = Number(env.PORT);

app.listen(port, () => {
  logger.info(`Prometheus service listening on port ${port}`);
});
