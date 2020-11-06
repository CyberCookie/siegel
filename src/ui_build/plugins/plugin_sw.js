// TODO
// const webpack   = require('webpack')
const path      = require('path')
const fs        = require('fs')


const NAME = 'siegel-sw-plugin'


module.exports = function(entry) {
    this.filename = path.basename(entry)

    this.apply = function(compiler) {
        compiler.hooks.emit.tapAsync(NAME, (compilation, cb) => {
            compilation.fileDependencies.add(entry)
            cb()
        })

        compiler.hooks.compilation.tap(NAME, ({ assets }) => {
            const SW_ASSETS = JSON.stringify(Object.keys(assets))
            // console.log('readFile')
            fs.readFile(entry, (err, buffer) => {
                const SW_SOURCE = `const buildOutput=${SW_ASSETS};${buffer.toString()}`
                assets[this.filename] = {
                    source: () => SW_SOURCE,
                    size: () => buffer.length
                }
            })


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
        })
    }
}