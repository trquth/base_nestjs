import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiResponseInterceptor } from './interceptors/api_response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
