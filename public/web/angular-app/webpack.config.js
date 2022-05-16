const path = require("path");
const BundleTracker = require('webpack-bundle-tracker');
const fs = require('fs');

module.exports = (config, options, targetOptions) => 
{
    let isDevMode = (config.mode === "development");
    let isDevServerMode = config.watch;
    let _path = path.resolve("./bundles/");
    let _publicPath = "/public/web/angular-app" + (isDevMode ? "/bundles/" : "/dist/");

    if(isDevServerMode) // Если запущен dev сервер
    {
        console.log()
        let PORT = config.devServer.port || 3000;
        config.plugins.push(new BundleTracker({filename: './config/webpack-stats-dev.json'}));
        _publicPath = `http://localhost:${ PORT }/assets/bundles/`;

        config.devServer = {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            devMiddleware: {
                publicPath: "/assets/bundles/"
            },
            historyApiFallback: true,
            static: {
                directory: path.join(__dirname, '/src/')
            },
            open: false,
            compress: true,
            hot: true,
            host: 'localhost',
            port: PORT
        }
    }
    else
        if(isDevMode) // Если компиляция в режиме dev
        {
            config.plugins.push(new BundleTracker({filename: './config/webpack-stats.json'}));
        } else
            if(!isDevMode) // Если компиляция в режиме prod
            {
                config.plugins.push(new BundleTracker({filename: './config/webpack-stats-prod.json'}));
                _path = require('path').resolve("./dist/");
            }
    config.context = __dirname;
    config.output = {
        path: _path,
        filename: "[name]-[fullhash].js",
        publicPath: _publicPath
    }
    return config;
};