'use strict'

import { relative } from 'path'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import { execSync as shell } from 'child_process'

import isRunDirectly from '../cjs/utils/is_run_directly.js'
import requireJSON from '../cjs/utils/require_json.js'
import { PATHS, LOC_NAMES, DEFAULT_RUN_PARAMS } from '../cjs/constants.js'


const {
    name: siegelPackageName,
    scripts: siegelPackageJSONScripts
} = requireJSON(`${PATHS.root}/${LOC_NAMES.PACKAGE_JSON}`)


const toJSON = data => JSON.stringify(data, null, 4)

function main(isGlobal) {
    if (DEFAULT_RUN_PARAMS._isSelfDevelopment) {
        throw new Error('Attempt to initialize demo_app inside siegel pckg')
    }


    const userClientPath = `${PATHS.cwd}/client`
    const userServerPath = `${PATHS.cwd}/server`
    const userAppEntry = `${userServerPath}/ts_entry.js`
    const pathToSiegel = relative(
        PATHS.cwd,
        isGlobal
            ?   `${shell('npm root -g').toString().trim()}/${siegelPackageName}`
            :   PATHS.root
    )

    const INIT_PATHS = {
        pathToSiegel, userAppEntry,
        pathToSiegelNodeModules:    `${pathToSiegel}/${LOC_NAMES.NODE_MODULES}`,
        siegelEsLint:               `${pathToSiegel}/${LOC_NAMES.ESLINT_JSON}`,
        userClientTSConfigPath:     `${userClientPath}/${LOC_NAMES.TS_JSON}`,
        userServerTSConfigPath:     `${userServerPath}/${LOC_NAMES.TS_JSON}`,
        userPackageJson:            `${PATHS.cwd}/${LOC_NAMES.PACKAGE_JSON}`,
        userTSGlobal:               `${PATHS.cwd}/${LOC_NAMES.TS_GLOBAL_TYPES}`,
        userESLint:                 `${PATHS.cwd}/${LOC_NAMES.ESLINT_JSON}`,
        siegelDemoAppShift:         relative(PATHS.demoProject, PATHS.root),
        cwdRelativeUserServer:      relative(PATHS.cwd, userAppEntry),
        userClientTSRelativePath:   relative(userClientPath, PATHS.cwd),
        userServerTSRelativePath:   relative(userServerPath, PATHS.cwd)
    }



    function createDemoApp() {
        // Copy demo_app
        shell(`cp -r ${PATHS.demoProject}/. .`)

        // Create global.d.ts
        writeFileSync(INIT_PATHS.userTSGlobal, `/// <reference types='${siegelPackageName}' />`)

        // Copy Eslint jsons
        shell(`cp ${ PATHS.root }/{${ LOC_NAMES.ESLINT_JSON },${ LOC_NAMES.TS_ESLINT_JSON }} .`)
    }


    function modifyTSConfigs() {
        const replaceDevPathWithSiegel = (path, userTsRootRelevance, oldDirName, newDirName) => (
            path.replace(
                `${INIT_PATHS.siegelDemoAppShift}/${userTsRootRelevance}/${oldDirName}`,
                `${userTsRootRelevance}/${INIT_PATHS.pathToSiegel}/${newDirName}`
            )
        )



        const clientTSConfig = requireJSON(INIT_PATHS.userClientTSConfigPath)

        const replacementArgs = [ INIT_PATHS.userClientTSRelativePath, LOC_NAMES.CLIENT_CORE_DIR_NAME, LOC_NAMES.CLIENT_CORE_OUTPUT_DIR_NAME ]
        clientTSConfig.extends = replaceDevPathWithSiegel(clientTSConfig.extends, ...replacementArgs)

        const paths = clientTSConfig.compilerOptions.paths
        for (const alias in paths) {
            paths[alias][0] = replaceDevPathWithSiegel(paths[alias][0], ...replacementArgs)
        }

        INIT_PATHS.siegelDemoAppShift && clientTSConfig.include.push(
            clientTSConfig.include.pop()
                .replace(`${INIT_PATHS.siegelDemoAppShift}/`, '')
        )

        writeFileSync(INIT_PATHS.userClientTSConfigPath, toJSON(clientTSConfig))



        const userServerTSConfig = requireJSON(INIT_PATHS.userServerTSConfigPath)

        userServerTSConfig.extends = replaceDevPathWithSiegel(
            userServerTSConfig.extends,
            INIT_PATHS.userServerTSRelativePath,
            LOC_NAMES.SRC_DIR_NAME,
            LOC_NAMES.SRC_OUTPUT
        )

        writeFileSync(INIT_PATHS.userServerTSConfigPath, toJSON(userServerTSConfig))
    }


    function modifyESLintConfig() {
        // Extend Eslint jsons
        const ESLintConfig = JSON.parse(readFileSync(INIT_PATHS.userESLint, 'utf8'))

        ESLintConfig.extends.push(
            INIT_PATHS.siegelEsLint[0] == '.' || INIT_PATHS.siegelEsLint[0] == '/'
                ?   INIT_PATHS.siegelEsLint
                :   `./${INIT_PATHS.siegelEsLint}`
        )
        ESLintConfig.ignorePatterns.pop()
        ESLintConfig.rules = {}

        writeFileSync(INIT_PATHS.userESLint, toJSON(ESLintConfig))
    }


    function modifyPackageJson() {
        existsSync(INIT_PATHS.userPackageJson) || shell('npm init -y')
        const targetPackageJSON = requireJSON(INIT_PATHS.userPackageJson)


        const internalPackageScripts = [ 'prepublishOnly' ]
        internalPackageScripts.forEach(command => {
            delete siegelPackageJSONScripts[command]
        })

        for (const command in siegelPackageJSONScripts) {
            let siegelPackageJSONCommand = siegelPackageJSONScripts[command]

            siegelPackageJSONScripts[command] = command == 'build_node'
                ?   siegelPackageJSONCommand.replace(LOC_NAMES.SRC_DIR_NAME, 'server')
                :   siegelPackageJSONCommand.replace(
                        '$npm_package_config_index',
                        command == 'pm2' ? LOC_NAMES.SRC_OUTPUT : INIT_PATHS.cwdRelativeUserServer
                    )
        }
        targetPackageJSON.scripts = siegelPackageJSONScripts

        writeFileSync(INIT_PATHS.userPackageJson, toJSON(targetPackageJSON))
    }


    function modiyDemoAppTsEntry() {
        const tsEntryContent = readFileSync(INIT_PATHS.userAppEntry, 'utf-8')
        const newContent = `require.main.paths.push('${INIT_PATHS.pathToSiegelNodeModules}');\n${tsEntryContent}`

        writeFileSync(INIT_PATHS.userAppEntry, newContent)
    }



    createDemoApp()
    modifyTSConfigs()
    modifyESLintConfig()
    modifyPackageJson()

    isGlobal && modiyDemoAppTsEntry()
}

isRunDirectly(import.meta) && main()


export default main