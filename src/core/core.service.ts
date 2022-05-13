import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Links } from './entity/links.entity';
import { Registry } from './entity/registry.entity';
import { Scheme } from './entity/scheme.entity';

@Injectable()
export class CoreService {
    constructor(
        @InjectRepository(Registry)
        private readonly registryRepository: Repository<Registry>,

        @InjectRepository(Links)
        private readonly linksRepository: Repository<Links>,

        @InjectRepository(Scheme)
        private readonly schemeRepository: Repository<Scheme>,
    ) {

    }
}
