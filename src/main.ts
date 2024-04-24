import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const appOptions = {
    cors: true,
  };
  const app = await NestFactory.create(AppModule, appOptions);
  app.enableShutdownHooks();
  const swaggerConf = new DocumentBuilder()
    .setTitle('Manhwa RESTapi')
    .setVersion('0.0.1')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConf);
  SwaggerModule.setup('api', app, swaggerDocument);
  await app.listen(3000);
}
bootstrap();
