'use strict'

import { relative } from 'path'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import { execSync as shell } from 'child_process'

import { isRunDirectly, requireJSON } from '../src/utils/index.js'
import { PATHS, LOC_NAMES, DEFAULT_RUN_PARAMS } from '../src/constants.js'


const {
    name: siegelPackageName,
    scripts: siegelPackageJSONScripts,
    type: siegelPackageType,
    main: siegelEntryPoint
} = requireJSON(PATHS.packageJSON)


const toJSON = data => JSON.stringify(data, null, 4)

function main(isGlobal) {
    if (DEFAULT_RUN_PARAMS._isSelfDevelopment) {
        throw new Error('Attempt to initialize demo_app inside siegel pckg')
    }


    const userClientPath = `${PATHS.cwd}/client`
    const userServerPath = `${PATHS.cwd}/server`
    const userAppEntry = `${userServerPath}/index.js`
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
        siegelDemoAppServerPath:    `${PATHS.demoProject}/server`,
        userClientTSConfigPath:     `${userClientPath}/${LOC_NAMES.TS_JSON}`,
        userServerPath:             `${userServerPath}/app_server.js`,
        userServerEntryPath:        `${userServerPath}/index.js`,
        userServerSiegelConfigPath: `${userServerPath}/siegel_config.js`,
        userPackageJson:            `${PATHS.cwd}/${LOC_NAMES.PACKAGE_JSON}`,
        userTSGlobal:               `${PATHS.cwd}/${LOC_NAMES.TS_GLOBAL_TYPES}`,
        userESLint:                 `${PATHS.cwd}/${LOC_NAMES.ESLINT_JSON}`,
        siegelDemoAppPathShift:     relative(PATHS.demoProject, PATHS.root),
        cwdRelativeUserServer:      relative(PATHS.cwd, userAppEntry),
        userClientTSRelativePath:   relative(userClientPath, PATHS.cwd)
    }



    function createDemoApp() {
        // Copy demo_app
        shell(`cp -r ${PATHS.demoProject}/. .`)

        // Create global.d.ts
        writeFileSync(INIT_PATHS.userTSGlobal, `/// <reference types='${siegelPackageName}' />`)

        // Copy Eslint jsons
        shell(`cp ${ PATHS.root }/{${ LOC_NAMES.ESLINT_JSON },${ LOC_NAMES.TS_ESLINT_JSON }} .`)
    }


    function modifyDemoAppSiegelPath() {
        const replaceStringPart = relative(
            INIT_PATHS.siegelDemoAppServerPath,
            `${PATHS.root}/${siegelEntryPoint}`
        )

        ;([ INIT_PATHS.userServerEntryPath, INIT_PATHS.userServerPath, INIT_PATHS.userServerSiegelConfigPath ])
            .forEach(path => {
                const newFileContent = readFileSync(path, 'utf8')
                    .replace(replaceStringPart, siegelPackageName)

                writeFileSync(path, newFileContent)
            })
    }


    function modifyTSConfigs() {
        const replaceDevPathWithSiegel = (path, newDirName) => (
            path.replace(
                `${INIT_PATHS.siegelDemoAppPathShift}/${INIT_PATHS.userClientTSRelativePath}/${LOC_NAMES.CLIENT_CORE_DIR_NAME}`,
                `${INIT_PATHS.userClientTSRelativePath}/${INIT_PATHS.pathToSiegel}/${newDirName}`
            )
        )


        const clientTSConfig = requireJSON(INIT_PATHS.userClientTSConfigPath)

        clientTSConfig.extends = replaceDevPathWithSiegel(clientTSConfig.extends, LOC_NAMES.CLIENT_CORE_DIR_NAME)

        const paths = clientTSConfig.compilerOptions.paths
        for (const alias in paths) {
            paths[alias][0] = replaceDevPathWithSiegel(
                paths[alias][0],
                `${LOC_NAMES.CLIENT_CORE_OUTPUT_DIR_NAME}/${LOC_NAMES.CLIENT_CORE_DIR_NAME}`
            )
        }

        if (INIT_PATHS.siegelDemoAppPathShift) {
            const tsConfigInclude = clientTSConfig.include
            const lastIndex = tsConfigInclude.length - 1
            //TODO: update with .at(-1) when drop old node support
            tsConfigInclude[ lastIndex ] = tsConfigInclude[ lastIndex ]
                .replace(`${INIT_PATHS.siegelDemoAppPathShift}/`, '')
        }

        writeFileSync(INIT_PATHS.userClientTSConfigPath, toJSON(clientTSConfig))
    }


    function modifyESLintConfig() {
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


        targetPackageJSON.type = siegelPackageType

        const internalPackageScripts = [ 'prepublishOnly', 'validate_siegel' ]
        internalPackageScripts.forEach(command => {
            delete siegelPackageJSONScripts[command]
        })

        for (const command in siegelPackageJSONScripts) {
            let siegelPackageJSONCommand = siegelPackageJSONScripts[command]

            siegelPackageJSONScripts[command] = siegelPackageJSONCommand.replace(
                '$npm_package_config_index',
                INIT_PATHS.cwdRelativeUserServer
            )
        }
        targetPackageJSON.scripts = siegelPackageJSONScripts

        writeFileSync(INIT_PATHS.userPackageJson, toJSON(targetPackageJSON))
    }


    function createNodePathExport() {
        writeFileSync(
            `${PATHS.cwd}/.profile`,
            `export NODE_PATH=${INIT_PATHS.pathToSiegelNodeModules}`
        )
    }



    createDemoApp()
    modifyDemoAppSiegelPath()
    modifyTSConfigs()
    modifyESLintConfig()
    modifyPackageJson()

    isGlobal && createNodePathExport()
}

isRunDirectly(import.meta) && main()


export default main