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
        return await this.registryRepository.findByIds(links.map(link => link.idFrom), /* { isDeleted: false } */)
    }
    async getDataByIdFrom(idFrom: number, idType: number): Promise<Registry[]>
    {
        let links = await this.getLinksByIdFrom(idFrom, idType);
        return await this.registryRepository.findByIds(links.map(link => link.idTo), /* { isDeleted: false } */)
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
    async getDataByQuery(query: any)
    {
        let out = {};
        let map = {};
        for(let i = 0; i < query.length; i++)
            for(let key in query[i])
            {
                map[key] = await this.getDataByIdTypeQuery(query[i][key], map);
                if(query[i][key].out !== false)
                    out[key] = map[key];
                // console.log(key, map[key])
            }
        return out;
    }
    private async getDataByIdTypeQuery({ idType, idTo, compare }, map)
    {
        if(compare)
        {
            let from = map[compare.from];
            let fromMap = {};
            let byFrom = compare.byFrom;
            let byTo = compare.byTo;
            let to = map[compare.to];

            from.forEach((item, i) => fromMap[item.id] = i);
            let out = [];
            for(let i = 0; i < to.length; i++)
            {
                let row = await this.getDataByIdType(byTo, to[i].id);
                out[i] = [];
                for(let j = 0; j < row.length; j++)
                {
                    let column = await this.getDataByIdFrom(row[j].id, byFrom);
                    out[i][fromMap[column[0].id]] = row[j];
                }
            }
            return out;
        }
        if(typeof idType === "string")
            idType = map[idType].map(item => item.id);
        if(typeof idTo === "string")
            idTo = map[idTo].map(item => item.id);
        
        let out = [];
        if(Array.isArray(idTo))
        {
            for(let i = 0; i < idTo.length; i++)
            {
                out.push(
                    await this.getDataByIdType(idType, idTo[i])
                );
            }
            if(out.length == 1) out = out[0];
        }
        else out = await this.getDataByIdType(idType, idTo);
        return out;
    }
    
    async getLinksByIdType(idType: number, idTo: number): Promise<Links[]>
    {
        return await this.linksRepository.find({ idType, idTo });
    }
    async getLinksByIdFrom(idFrom: number, idType: number): Promise<Links[]>
    {
        return await this.linksRepository.find({ idFrom, idType });
    }
}
