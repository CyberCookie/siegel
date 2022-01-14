"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Compilation, sources } = require('webpack');
const { readFileSync } = require('fs');
const { basename } = require('path');
const NAME = 'siegel-sw-plugin';
module.exports = function (entry) {
    const filename = basename(entry);
    const swContent = readFileSync(entry).toString();
    this.apply = function (compiler) {
        compiler.hooks.thisCompilation.tap(NAME, compilation => {
            compilation.hooks.processAssets.tap({
                name: NAME,
                stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
            }, assets => {
                const SW_ASSETS = JSON.stringify(Object.keys(assets));
                const SW_SOURCE = `const buildOutput=${SW_ASSETS};${swContent}`;
                compilation.emitAsset(filename, new sources.RawSource(SW_SOURCE, true));
            });
        });
    };
};
