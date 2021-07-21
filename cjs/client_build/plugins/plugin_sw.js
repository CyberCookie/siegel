"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require('webpack');
const fs = require('fs');
const { basename } = require('path');
const NAME = 'siegel-sw-plugin';
module.exports = function (entry) {
    const filename = basename(entry);
    this.apply = function (compiler) {
        compiler.hooks.compilation.tap(NAME, ({ hooks }) => {
            hooks.processAssets.tap({
                name: NAME,
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
            }, assets => {
                const SW_ASSETS = JSON.stringify(Object.keys(assets));
                fs.readFile(entry, (_, buffer) => {
                    const SW_SOURCE = `const buildOutput=${SW_ASSETS};${buffer.toString()}`;
                    assets[filename] = new webpack.sources.RawSource(SW_SOURCE, true);
                });
            });
        });
    };
};
