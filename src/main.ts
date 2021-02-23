import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
  .setTitle('Api ')
  .setDescription('API Doc')
  .setVersion('0.1')
  .addTag('Api')
  .build();

const document = SwaggerModule.createDocument(app, options);
SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
