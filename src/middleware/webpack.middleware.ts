import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { ReadFile } from '../system/read-file';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class WebpackLoader
{
    projects = {
        "angular-app": {
            pathToConfig: join(__dirname, '../..', '/public/web/angular-app/config'),
            head: [ "styles" ],
            body: [ "main", "polyfills", "runtime", "vendor" ],
            out: {
                head: [],
                body: []
            }
        }
    }
    constructor(private readonly configService: ConfigService)
    {
    }
    async loadProject(name, baseHref): Promise<{
        scriptsHead: string,
        scriptsBody: string,
        baseHref: string
    }>
    {
        const project = this.projects[name];
        let file = new ReadFile(join(project.pathToConfig, this.getWebpackJSON() ));
        let data = await file.readFileJSON<{
            assets: {
                [key: string]: any
            }
        }>();
        
        return {
            scriptsHead: project.head.map(name => `<script src="${ this.getBundleByName(data.assets, name).publicPath }" defer></script>`).join("\n"),
            scriptsBody: project.body.map(name => `<script src="${ this.getBundleByName(data.assets, name).publicPath }" defer></script>`).join("\n"),
            baseHref
        }
    }
    private getBundleByName(assets, name)
    {
        for(let key in assets)
            if(key.split("-")[0] === name) return assets[key];
    }
    private getWebpackJSON()
    {
        switch(this.configService.get<string>("mode"))
        {
            case "prod":
                return "webpack-stats-prod.json";
            case "debug":
                return "webpack-stats.json";
            case "watch":
                return "webpack-stats-dev.json";
        }
    }
}
