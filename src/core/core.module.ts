import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebpackLoader } from '../middleware/webpack.middleware';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { Links } from './entity/links.entity';
import { Registry } from './entity/registry.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
    imports: [
        TypeOrmModule.forFeature([ Links, Registry ]),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'hannibal.beget.tech',
            port: 3306,
            username: 'hannibal_scada',
            password: '25m@d92',
            database: 'hannibal_scada',
            entities: [ Registry, Links ],
            synchronize: true,
        }),
    ],
    controllers: [CoreController],
    providers: [CoreService, ConfigService, WebpackLoader]
})
export class CoreModule {}
