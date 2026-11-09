import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow the React app (another port) to call this API
  app.enableCors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' });

  // Validate every request body against its DTO class.
  // Bad input (e.g. quantity: "abc") → 400 Bad Request automatically.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip fields not declared in the DTO
      forbidNonWhitelisted: true, // ...and reject the request if any were sent
      transform: true, // turn plain JSON into DTO class instances
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}`);
}
await bootstrap();
