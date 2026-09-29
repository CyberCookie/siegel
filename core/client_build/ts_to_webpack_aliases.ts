import { join } from 'path'

import { LOC_NAMES } from '../constants'
import { serverUtils } from '../server'

import type { TSConfig } from '../../bin/init_project'


async function tsToWebpackAliases(tsConfigDirPath: string, tsConfigFileName = LOC_NAMES.TS_JSON) {
    const tsConfigPath =  join(tsConfigDirPath, tsConfigFileName)

    let paths: TSConfig['compilerOptions']['paths'] = {}
    try {
        const tsConfig = await serverUtils.requireJSON<TSConfig>(tsConfigPath)

        const compilerOptions = tsConfig?.compilerOptions
        if (compilerOptions) {
            if (compilerOptions?.paths) {
                paths = compilerOptions!.paths

            } else console.error('Field [paths] doesn`t exist in [compilerOptions]\nin %s', tsConfigPath)

        } else console.error('Field [compilerOptions] doesn`t exist\nin %s', tsConfigPath)

    } catch (e) {
        console.error('Can`t process %s located at:\n%s\n%s', LOC_NAMES.TS_JSON, tsConfigPath, e)
    }


    const aliases: Obj<string> = {}
    for (let i = 0, keys = Object.keys(paths), l = keys.length; i < l; i++) {
        const key = keys[i]

        const WPAlias = key.replace('/*', '')
        const WPPath = paths[key][0].replace('/*', '')

        aliases[WPAlias] = join(tsConfigDirPath, WPPath)
    }


    return aliases as NonNullableProps<typeof aliases>
}


export default tsToWebpackAliases