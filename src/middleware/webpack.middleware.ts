import { Injectable } from '@nestjs/common';

@Injectable()
export class WebpackLoader {
    constructor()
    {
        console.log("Найти webpack.config")
    }
}
