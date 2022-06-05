import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Links } from './entity/links.entity';
import { Registry } from './entity/registry.entity';
@Injectable()
export class CoreService {
    constructor(
        @InjectRepository(Registry)
        private readonly registryRepository: Repository<Registry>,

        @InjectRepository(Links)
        private readonly linksRepository: Repository<Links>,
    ) {

    }
    async appendData(data: Registry)
    {
        if(!data.value) throw new HttpException("[InsertError] Value cannot be empty", HttpStatus.INTERNAL_SERVER_ERROR);
        let newData = await this.registryRepository.save({
            value: data.value,
        });
        return await this.getOneData(newData.id);
    }
    async removeData(data: Registry)
    {
        await this.registryRepository.update(data.id, {
            isDeleted: true
        });
    }
    async createLink(link: Links)
    {
        /* if(!data.value) throw new HttpException("[InsertError] Value cannot be empty", HttpStatus.INTERNAL_SERVER_ERROR); */
        let newData = await this.linksRepository.save({
            idFrom: link.idFrom,
            idType: link.idType,
            idTo: link.idTo,
        });
        return await this.getOneLink(newData.id);
    }
    async getAllData(): Promise<Registry[]>
    {
        return await this.registryRepository.find({ isDeleted: false });
    }
    async getOneData(id: number): Promise<Registry>
    {
        return await this.registryRepository.findOne(id);
    }
    async getAllLinks(): Promise<Links[]>
    {
        return await this.linksRepository.find();
    }
    async getOneLink(id: number): Promise<Links>
    {
        return await this.linksRepository.findOne(id);
    }
    async getDataByIdType(idType: number, idTo: number): Promise<Registry[]>
    {
        let links = await this.getLinksByIdType(idType, idTo);
        console.log(idType, idTo, links)
        return await this.registryRepository.findByIds(links.map(link => link.idFrom), /* { isDeleted: false } */)
    }
    async getDataByIdTypeRecursion(idType: number, idTo: number): Promise<Registry[]>
    {
        let out: any = await this.getDataByIdType(idType, idTo);
        for(let i = 0; i < out.length; i++)
        {
            out[i].children = await this.getDataByIdTypeRecursion(idType, out[i].id);
        }
        return out;
    }
    async getDataByQuery(_query: any)
    {
        let query = [{
            by: {
                idType: 8, // Схему данных
                idTo: 9, // По Отделу АСУЭ
                as: "children",
                /* where: {
                    10: {
                        as: "header",
                        by: {
                            idType: 14,
                            idTo: "$parent",
                            as: "data"
                        },
                        compare: [{
                            idType: 14,
                            idTo: "$parent",
                            as: "data"
                        }]
                    }
                } */
            },
            compare: {
                idType: 12,
                idTo: 13,
            }
        }];
        let out = [];
        for(let i = 0; i < query.length; i++)
        {
            let by = query[i].by;
            if(by)
            {
                let main = await this.getOneData(by.idTo);
                main[by.as] = [
                    ...await this.getDataByIdTypeTree(by.idType, by.idTo, by)
                ];
                out.push(main);
            }
            let compare = query[i].compare;
            if(compare)
            {
                console.log("[compare]")
                let main = await this.getDataByIdType(compare.idType, compare.idTo);
                out.push(main);
            }
        }
        return out;
    }
    async getDataByIdTypeTree(idType, idTo, query: {
        idType: number
        idTo: number
        as: string
        where?: any
    }): Promise<Registry[]>
    {
        let out: any = await this.getDataByIdType(idType, idTo);
        for(let i = 0; i < out.length; i++)
        {
            let id = out[i].id;
            let name = query.as;
            let subBy;
            if(query.where && query.where[id])
            {
                name = query.where[id].as;
                subBy = query.where[id].by
            }
            out[i][name] = await this.getDataByIdTypeTree(idType, id, query);
            if(subBy)
            {
                for(let j = 0; j < out[i][name].length; j++)
                {
                    let element = out[i][name][j];
                    element[subBy.as] = await this.getDataByIdTypeTree(subBy.idType, subBy.idTo === "$parent" ? element.id : subBy.idTo, subBy);
                }
            }
        }
        return out;
    }
    async getLinksByIdType(idType: number, idTo: number): Promise<Links[]>
    {
        return await this.linksRepository.find({ idType, idTo });
    }
}
