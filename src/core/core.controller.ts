import { Controller, Get, Render } from '@nestjs/common';
import { WebpackLoader } from '../middleware/webpack.middleware';
import { CoreService } from './core.service';

@Controller('core')
export class CoreController {
    constructor(
        private readonly coreService: CoreService,
        private webpackLoader: WebpackLoader
    ) {

    }
    @Get()
    @Render("angular")
    root()
    {
        return {
            scripts: "test"
        }
    }
}
