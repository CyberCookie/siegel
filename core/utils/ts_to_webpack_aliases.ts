import { join } from 'path'

import { LOC_NAMES } from '../constants'
import requireJSON from './require_json'

import type { CompilerOptions } from 'typescript'


function tsToWebpackAliases(tsConfigDirPath: string, tsConfigFileName = LOC_NAMES.TS_JSON) {
    const tsConfigPath =  join(tsConfigDirPath, tsConfigFileName)

    let paths: CompilerOptions['paths'] = {}
    try {
        const tsConfig = requireJSON(tsConfigPath)

        const compilerOptions = tsConfig?.compilerOptions as CompilerOptions
        if (compilerOptions) {
            if (compilerOptions?.paths) {
                paths = compilerOptions!.paths

            } else console.error('Field [paths] is not exist in [compilerOptions]\nin %s', tsConfigPath)

        } else console.error('Field [compilerOptions] is not exist\nin %s', tsConfigPath)

    } catch (e) {
        console.error('Can`t process %s located at:\n%s\n%s', LOC_NAMES.TS_JSON, tsConfigPath, e)
    }


    const aliases: Obj<string> = {}
    Object.entries(paths!)
        .forEach(([ tsAlias, tsAliasPaths ]) => {
            const WPAlias = tsAlias.replace('/*', '')
            const WPPath = tsAliasPaths[0].replace('/*', '')

            aliases[WPAlias] = join(tsConfigDirPath, WPPath)
        })


    return aliases as NonNullableProps<typeof aliases>
}


export default tsToWebpackAliases