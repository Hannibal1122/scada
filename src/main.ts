import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors();
    app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: "/public/" });
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');
    app.use(cookieParser());
    hbs.registerPartials(join(__dirname, '..', 'views/partials'));
    await app.listen(3000);
}
bootstrap();
