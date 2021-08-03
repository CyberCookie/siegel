const { Compilation, sources }  = require('webpack')
const { readFile }              = require('fs')
const { basename }              = require('path')


const NAME = 'siegel-sw-plugin'


module.exports = function(entry) {
    const filename = basename(entry)

    this.apply = function(compilation) {
        compilation.hooks.thisCompilation.tap(NAME, ({ hooks }) => {
            hooks.processAssets.tap({
                name: NAME,
                stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
            }, assets => {
                const SW_ASSETS = JSON.stringify(Object.keys(assets))

                readFile(entry, (_, buffer) => {
                    const SW_SOURCE = `const buildOutput=${SW_ASSETS};${buffer.toString()}`
                    assets[filename] = new sources.RawSource(SW_SOURCE, true)
                })
            })
        })
    }
}
export {}