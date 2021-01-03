const { join, relative, posix }                     = require('path')
const { existsSync, writeFileSync, readFileSync }   = require('fs')

const { PATHS }                                     = require('../constants')


function main(isGlobal) {
    const shell = require('child_process').execSync;
    const cwd = process.cwd()
    const {
        name: devCorePackageName,
        scripts: siegelPackageJSONScripts,
        config: devCorePackageConfig
    } = require(PATHS.package)
    
    
    const toJSON = data => JSON.stringify(data, null, 4)

    const replaceDevPathWithModule = path => {
        const { join, relative } = posix;

        const replaceWith = isGlobal
            ?   join(relative(__dirname, PATHS.globalNodeModules), devCorePackageName)
            :   './' + join('node_modules', devCorePackageName)

        
        return path.replace('..', replaceWith)
    }
    

    
    //Copy test project
    shell(`cp -r ${PATHS.demoProject}/. .`)
    
    
    existsSync(PATHS.cwdPackageJSON) || shell('npm init -y')
    const targetPackageJSON = require(PATHS.cwdPackageJSON)
        
    const TSPath = join(cwd, 'tsconfig')
    const TSConfig = require(TSPath)

    // const TSNodePath = join(cwd, 'src', 'ts_node', 'tsconfig.json')
    // const TSNodeConfig = require(TSNodePath)
    // TSNodeConfig.compilerOptions.outDir = TSNodeConfig.compilerOptions.outDir.replace('../', '')

    const ESLintPath = join(cwd, '.eslintrc')
    const ESLintConfig = JSON.parse(readFileSync(ESLintPath), 'utf8')



    
    //Update project JSONs
    const exampleDirPathFromRoot = relative(PATHS.root, PATHS.demoProject)
    let pathToIndex = devCorePackageConfig.index.replace(exampleDirPathFromRoot, '')
    pathToIndex = pathToIndex.substr(pathToIndex.search(/\w/))
    

    for (const command in siegelPackageJSONScripts) {
        const siegelPackageJSONCommand = siegelPackageJSONScripts[command]
        // if (siegelPackageJSONCommand == 'build_node') {
        //     const commandParsed = siegelPackageJSONCommand.split(' ')
        //     commandParsed[commandParsed.length - 1] = 
        // }

        siegelPackageJSONScripts[command] = siegelPackageJSONCommand
            .replace('$npm_package_config_index', pathToIndex)
    }
    targetPackageJSON.scripts = siegelPackageJSONScripts;
    writeFileSync(PATHS.cwdPackageJSON, toJSON(targetPackageJSON))
    
    
    
    
    TSConfig.extends = replaceDevPathWithModule(TSConfig.extends)
    
    const paths = TSConfig.compilerOptions.paths;
    for (const alias in paths) {
        paths[alias][0] = replaceDevPathWithModule(paths[alias][0])
    }
    writeFileSync(TSPath, toJSON(TSConfig))
    
    
    
    
    ESLintConfig.extends = replaceDevPathWithModule(ESLintConfig.extends[0])
    writeFileSync(ESLintPath, toJSON(ESLintConfig))
}


module.parent
    ?   (module.exports = main)
    :   main()