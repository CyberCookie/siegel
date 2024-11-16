import fs from 'fs'
import path from 'path'
import webpack, { WebpackPluginInstance, Compiler } from 'webpack'
import ts from 'typescript'


type SwPluginOptions = string

type SwPluginClassCtor = {
    new(options: SwPluginOptions): WebpackPluginInstance
    (): WebpackPluginInstance
}


const { sources, Compilation } = webpack

const NAME = 'siegel-sw-plugin'

const serviceWorkerPlugin = function(this: WebpackPluginInstance, entry: SwPluginOptions) {
    const filename = path.basename(entry)
    const swContent = fs.readFileSync(entry, 'utf8')


    this.apply = function(compiler: Compiler) {
        compiler.hooks.thisCompilation.tap(NAME, compilation => {
            compilation.hooks.processAssets.tap({
                name: NAME,
                stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
            }, assets => {
                const SW_ASSETS = JSON.stringify(Object.keys(assets))
                const isTS = filename.endsWith('.ts')

                const SW_SOURCE = `const buildOutput=${SW_ASSETS};${isTS ? ts.transpile(swContent) : swContent}`

                compilation.emitAsset(
                    isTS ? filename.replace('.ts', '.js') : filename,
                    new sources.RawSource(SW_SOURCE, true)
                )
            })
        })
    }
} as SwPluginClassCtor


export default serviceWorkerPlugin
export type { SwPluginClassCtor, SwPluginOptions }