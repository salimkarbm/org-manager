import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envConfig } from './common/config/env.config';
import { ValidationPipe } from './common/pipe/validate.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // set global prefix
  app.setGlobalPrefix('api');

  (app as any).set('etag', false);
  app.use((req, res, next) => {
    res.removeHeader('x-powered-by');
    res.removeHeader('date');
    next();
  });

  await app.listen(envConfig.PORT);
}
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});
bootstrap();
