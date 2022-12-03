import { join } from 'path'

import { LOC_NAMES } from '../constants'
import requireJSON from './require_json'


function tsToWebpackAliases(rootPath: string) {
    const { paths } = requireJSON(
        join(rootPath, LOC_NAMES.TS_JSON)
    ).compilerOptions


    const aliases: Obj = {}
    for (const alias in paths) {
        const WPAlias = alias.replace('/*', '')
        const WPPath = paths[alias][0].replace('/*', '')

        aliases[WPAlias] = join(rootPath, WPPath)
    }


    return aliases
}


export default tsToWebpackAliases