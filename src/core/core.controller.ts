import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { WebpackLoader } from '../middleware/webpack.middleware';
import { CoreService } from './core.service';
import { Links } from './entity/links.entity';
import { Registry } from './entity/registry.entity';

@Controller('core')
export class CoreController {
    constructor(
        private readonly coreService: CoreService,
        private webpackLoader: WebpackLoader
    ) {

    }
    @Get()
    @Render("angular")
    async root()
    {
        return await this.webpackLoader.loadProject("angular-app", "/core/");
    }

    @Post("/append_data/")
    async appendData(@Body() data: Registry): Promise<Registry>
    {
        return this.coreService.appendData(data);
    }
    @Post("/get_data/")
    async getData(): Promise<Registry[]>
    {
        return this.coreService.getAllData();
    }
    @Post("/create_link/")
    async createLink(@Body() link: Links): Promise<Links>
    {
        return this.coreService.createLink(link);
    }
    @Post("/get_links/")
    async getLinks(): Promise<Links[]>
    {
        return this.coreService.getAllLinks();
    }
    @Post("/remove_data/")
    async removeData(@Body() data: Registry)
    {
        return this.coreService.removeData(data);
    }
    @Post("/get_data_by_type/")
    async getDataByIdType(@Body() data: { idType: number, idTo: number })
    {
        return this.coreService.getDataByIdType(data.idType, data.idTo);
    }
    @Post("/get_data_by_type_recursion/")
    async getDataByIdTypeRecursion(@Body() data: { idType: number, idTo: number })
    {
        return this.coreService.getDataByIdTypeRecursion(data.idType, data.idTo);
    }
    @Post("/get_data_by_query/")
    async getDataByQuery(@Body() query: any)
    {
        return this.coreService.getDataByQuery(query);
    }
}