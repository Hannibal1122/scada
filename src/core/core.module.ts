import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { Links } from './entity/links.entity';
import { Registry } from './entity/registry.entity';
import { Scheme } from './entity/scheme.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Links, Registry, Scheme ]),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'hannibal.beget.tech',
            port: 3306,
            username: 'hannibal_scada',
            password: '25m@d92',
            database: 'hannibal_scada',
            entities: [ Registry, Links, Scheme ],
            synchronize: true,
        }),
    ],
    controllers: [CoreController],
    providers: [CoreService]
})
export class CoreModule {}
