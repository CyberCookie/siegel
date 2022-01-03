'use strict'

const { join, relative }                            = require('path')
const { existsSync, writeFileSync, readFileSync }   = require('fs')
const shell                                         = require('child_process').execSync

const { PATHS, LOC_NAMES }                          = require('../cjs/constants')
const siegelPackageJson                             = require(PATHS.package)



const {
    name: siegelPackageName,
    scripts: siegelPackageJSONScripts,
    config: devCorePackageConfig
} = siegelPackageJson




const ESLintPath = join(PATHS.cwd, LOC_NAMES.ESLINT_JSON)

const demoDirPathFromRoot = relative(PATHS.root, PATHS.demoProject)
let pathToIndex = devCorePackageConfig.index.replace(demoDirPathFromRoot, '')
pathToIndex = pathToIndex.substr(pathToIndex.search(/\w/))



const toJSON = data => JSON.stringify(data, null, 4)

function main(isGlobal) {
    const pathToSiegel = isGlobal
        ?   join(relative(PATHS.cwd, PATHS.globalNodeModules), siegelPackageName)
        :   join('..', LOC_NAMES.NODE_MODULES, siegelPackageName)


    function createDemoApp() {
        //Copy demo_app
        shell(`cp -r ${PATHS.demoProject}/. .`)

        //Create global.d.ts
        writeFileSync(join(PATHS.cwd, LOC_NAMES.TS_GLOBAL_TYPES), `/// <reference types='${siegelPackageName}' />`)

        //Copy Eslint jsons
        shell(`cp ${ PATHS.root }/{${ LOC_NAMES.ESLINT_JSON },${ LOC_NAMES.TS_ESLINT_JSON }} .`)
    }


    function modifyTSConfigs() {
        const userClientTSConfigPath = join(PATHS.cwd, 'client', LOC_NAMES.TS_JSON)
        const clientTSConfig = require(userClientTSConfigPath)

        const userServerTSConfigPath = join(PATHS.cwd, 'server', LOC_NAMES.TS_JSON)
        const userServerTSConfig = require(userServerTSConfigPath)

        const replaceDevPathWithSiegel = path => path.replace('../..', pathToSiegel)


        clientTSConfig.extends = replaceDevPathWithSiegel(clientTSConfig.extends)
        clientTSConfig.include.push(
            clientTSConfig.include.pop().replace('../', '')
        )

        const paths = clientTSConfig.compilerOptions.paths
        for (const alias in paths) {
            paths[alias][0] = paths[alias][0].replace(
                `../../${LOC_NAMES.CLIENT_CORE_DIR_NAME}`,
                `${pathToSiegel}/${LOC_NAMES.CLIENT_CORE_OUTPUT_DIR_NAME}`
            )
        }


        userServerTSConfig.extends = replaceDevPathWithSiegel(userServerTSConfig.extends)


        writeFileSync(userClientTSConfigPath, toJSON(clientTSConfig))
        writeFileSync(userServerTSConfigPath, toJSON(userServerTSConfig))
    }


    function modifyESLintConfig() {
        //Extend Eslint jsons
        const ESLintConfig = JSON.parse(readFileSync(ESLintPath, 'utf8'))

        ESLintConfig.extends.push(
            isGlobal
                ?   join(pathToSiegel, LOC_NAMES.ESLINT_JSON)
                :   `./${join(LOC_NAMES.NODE_MODULES, siegelPackageName, LOC_NAMES.ESLINT_JSON)}`
        )
        ESLintConfig.ignorePatterns.pop()
        ESLintConfig.rules = {}

        writeFileSync(ESLintPath, toJSON(ESLintConfig))
    }


    function modifyPackageJson() {
        //Extend package.json
        existsSync(PATHS.cwdPackageJSON) || shell('npm init -y')
        const targetPackageJSON = require(PATHS.cwdPackageJSON)


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
                        command == 'pm2' ? 'cjs' : pathToIndex
                    )
        }
        targetPackageJSON.scripts = siegelPackageJSONScripts

        writeFileSync(PATHS.cwdPackageJSON, toJSON(targetPackageJSON))
    }


    function modiyDemoAppTsEntry() {
        const demoAppTsEntryPath = join(PATHS.cwd, 'server', 'ts_entry.js')

        const tsEntryContent = readFileSync(demoAppTsEntryPath, 'utf-8')
        const newContent = `require.main.paths.push('${PATHS.globalNodeModules}/siegel/node_modules');\n${tsEntryContent}`

        writeFileSync(demoAppTsEntryPath, newContent)
    }



    createDemoApp()
    modifyTSConfigs()
    modifyESLintConfig()
    modifyPackageJson()

    isGlobal && modiyDemoAppTsEntry()
}


require.main == module
    ?   main()
    :   (module.exports = main)