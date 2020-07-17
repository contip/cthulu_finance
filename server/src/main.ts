import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /* enable CORS since api calls made using server */
  app.enableCors();
  await app.listen(6969);
}
bootstrap();
