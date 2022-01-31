import fs from 'fs'
import path from 'path'
import webpack from 'webpack'


const { sources, Compilation } = webpack

const NAME = 'siegel-sw-plugin'

function serviceWorkerPlugin(entry) {
    const filename = path.basename(entry)
    const swContent = fs.readFileSync(entry, 'utf8')


    this.apply = function(compiler) {
        compiler.hooks.thisCompilation.tap(NAME, compilation => {
            compilation.hooks.processAssets.tap({
                name: NAME,
                stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
            }, assets => {
                const SW_ASSETS = JSON.stringify(Object.keys(assets))
                const SW_SOURCE = `const buildOutput=${SW_ASSETS};${swContent}`

                compilation.emitAsset(
                    filename,
                    new sources.RawSource(SW_SOURCE, true)
                )
            })
        })
    }
}


export default serviceWorkerPlugin