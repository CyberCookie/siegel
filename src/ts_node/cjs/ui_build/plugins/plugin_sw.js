// const webpack   = require('webpack')
const path = require('path');
const fs = require('fs');
const NAME = 'siegel-sw-plugin';
module.exports = function (entry) {
    const filename = path.basename(entry);
    this.apply = function (compiler) {
        compiler.hooks.emit.tapAsync(NAME, ({ assets, fileDependencies }, cb) => {
            fileDependencies.add(entry);
            const watchFiles = compiler.watchFileSystem.watcher.mtimes;
            const isWatchItems = Object.keys(watchFiles).length;
            if (!isWatchItems || watchFiles[entry]) {
                fs.readFile(entry, (err, buffer) => {
                    const SW_ASSETS = JSON.stringify(Object.keys(assets));
                    const SW_SOURCE = `const buildOutput=${SW_ASSETS};${buffer.toString()}`;
                    assets[filename] = {
                        source: () => SW_SOURCE,
                        size: () => buffer.length
                    };
                    cb();
                });
            }
            else
                cb();
        });
        // compiler.hooks.compilation.tap(NAME, ({ assets }) => {
        //webpack 5
        // compilation.hooks.processAssets.tap({
        //     name: NAME,
        //     stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
        // }, assets => {
        //     const SW_ASSETS = JSON.stringify(Object.keys(assets))
        //     fs.readFile(entry, (err, buffer) => {
        //         const SW_SOURCE = `const buildOutput=${SW_ASSETS};${buffer.toString()}`
        //         assets[this.filename] = {
        //             source: () => SW_SOURCE,
        //             size: () => buffer.length
        //         }
        //     })
        // })
        // })
    };
};
