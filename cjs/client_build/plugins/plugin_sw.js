const webpack = require('webpack');
const fs = require('fs');
const NAME = 'siegel-sw-plugin';
module.exports = function (entry) {
    this.apply = function (compiler) {
        compiler.hooks.compilation.tap(NAME, ({ hooks }) => {
            hooks.processAssets.tap({
                name: NAME,
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
            }, assets => {
                const SW_ASSETS = JSON.stringify(Object.keys(assets));
                fs.readFile(entry, (err, buffer) => {
                    const SW_SOURCE = `const buildOutput=${SW_ASSETS};${buffer.toString()}`;
                    assets[this.filename] = {
                        source: () => SW_SOURCE,
                        size: () => buffer.length
                    };
                });
            });
        });
    };
};
