import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const PORT = process.env.PORT || 6969;
  await app.listen(PORT);
  console.log(`Listening on port: ${PORT}`);
}
bootstrap();
