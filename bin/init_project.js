//TODO: console output: checkboxes, progress, timings

'use strict'

const { join, relative }                            = require('path')
const { existsSync, writeFileSync, readFileSync }   = require('fs')
const shell                                         = require('child_process').execSync

const { PATHS, LOC_NAMES }                          = require('../cjs/constants')
const siegelPackageJson                             = require(PATHS.package)



const {
    name: devCorePackageName,
    scripts: siegelPackageJSONScripts,
    config: devCorePackageConfig
} = siegelPackageJson


const TSPath = join(PATHS.cwd, LOC_NAMES.TS_JSON)
const ESLintPath = join(PATHS.cwd, LOC_NAMES.ESLINT_JSON)

const demoDirPathFromRoot = relative(PATHS.root, PATHS.demoProject)
let pathToIndex = devCorePackageConfig.index.replace(demoDirPathFromRoot, '')
pathToIndex = pathToIndex.substr(pathToIndex.search(/\w/))



const toJSON = data => JSON.stringify(data, null, 4)

const getLocalPathToSiegel = (...args) => join(LOC_NAMES.NODE_MODULES, ...args)

function main(isGlobal) {
    const replaceDevPathWithModule = path => {
        const replaceWith = isGlobal
            ?   join(relative(__dirname, PATHS.globalNodeModules), devCorePackageName)
            :   getLocalPathToSiegel(devCorePackageName)


        return path.replace(
            '..',
            replaceWith.replace(LOC_NAMES.CLIENT_CORE_DIR_NAME, LOC_NAMES.CLIENT_CORE_OUTPUT_DIR_NAME)
        )
    }



    //Copy demo_app
    shell(`cp -r ${PATHS.demoProject}/. .`)

    //Create demo app global.d.ts
    writeFileSync(join(PATHS.cwd, LOC_NAMES.TS_GLOBAL_TYPES), `/// <reference types='${devCorePackageName}' />`)

    //Copy Eslint jsons
    shell(`cp ${ PATHS.root }/{${ LOC_NAMES.ESLINT_JSON },${ LOC_NAMES.TS_ESLINT_JSON }} .`)

    //Copy ts-node tsconfig.json
    shell(`cp ${join( PATHS.root, LOC_NAMES.SRC_DIR_NAME, LOC_NAMES.TS_JSON )} ${LOC_NAMES.SERVER_DIR_NAME}`)



    //Extend TSConfig
    const TSConfig = require(TSPath)

    TSConfig.extends = replaceDevPathWithModule(TSConfig.extends)
    TSConfig.include.push(
        TSConfig.include.pop().replace('..', '.')
    )

    const paths = TSConfig.compilerOptions.paths
    for (const alias in paths) {
        paths[alias][0] = replaceDevPathWithModule(paths[alias][0])
    }

    writeFileSync(TSPath, toJSON(TSConfig))



    //Extend Eslint jsons
    const ESLintConfig = JSON.parse(readFileSync(ESLintPath, 'utf8'))

    ESLintConfig.extends.push( getLocalPathToSiegel(devCorePackageName, LOC_NAMES.ESLINT_JSON) )
    ESLintConfig.rules = {}

    writeFileSync(ESLintPath, toJSON(ESLintConfig))



    //Extend package.json
    existsSync(PATHS.cwdPackageJSON) || shell('npm init -y')
    const targetPackageJSON = require(PATHS.cwdPackageJSON)


    const internalPackageScripts = [ 'prepublishOnly', 'validate_siegel' ]
    internalPackageScripts.forEach(command => {
        delete siegelPackageJSONScripts[command]
    })

    for (const command in siegelPackageJSONScripts) {
        let siegelPackageJSONCommand = siegelPackageJSONScripts[command]

        siegelPackageJSONScripts[command] = command == 'build_node'
        ?   siegelPackageJSONCommand.replace(LOC_NAMES.SRC_DIR_NAME, LOC_NAMES.SERVER_DIR_NAME)
        :   siegelPackageJSONCommand.replace(
                '$npm_package_config_index',
                command == 'pm2' ? 'cjs' : pathToIndex
            )
    }
    targetPackageJSON.scripts = siegelPackageJSONScripts

    writeFileSync(PATHS.cwdPackageJSON, toJSON(targetPackageJSON))
}


require.main == module
    ?   main()
    :   (module.exports = main)