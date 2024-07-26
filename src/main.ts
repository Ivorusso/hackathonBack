import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useWebSocketAdapter(new IoAdapter(app));

  app.use((req, res, next) => {
    console.log(`Request received at ${req.url}`);
    next();
  });

  await app.listen(3000);
  console.log('NestJS application listening on port 3000');
}
bootstrap();
