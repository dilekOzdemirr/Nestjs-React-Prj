import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // Frontendten gelen isteklere izin ver demek icin
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO'da tanımlı olmayan fazlalık verileri otomatik siler.
    transform: true,// gelen veriyi DTO tipine dönüştürür
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
