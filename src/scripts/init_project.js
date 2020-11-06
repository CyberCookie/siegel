const { join, relative, posix }                     = require('path')
const { existsSync, writeFileSync, readFileSync }   = require('fs')

const { PATHS }                                     = require('../constants')


function main() {
    const shell = require('child_process').execSync;
    const cwd = process.cwd()
    const {
        name: devCorePackageName,
        scripts: devCorePackageScripts,
        config: devCorePackageConfig
    } = require(PATHS.package)
    
    
    const toJSON = data => JSON.stringify(data, null, 4)

    const replaceDevPathWithModule = path => path.replace(
        '..',
        './' + posix.join('node_modules', devCorePackageName)
    )
    

    
    //Copy test project
    shell(`cp -r ${PATHS.demoProject}/. .`)
    
    
    existsSync(PATHS.cwdPackageJSON) || shell('npm init -y')
    const targetPackageJSON = require(PATHS.cwdPackageJSON)
        
    const TSPath = join(cwd, 'tsconfig.json')
    const TSConfig = require(TSPath)

    const ESLintPath = join(cwd, '.eslintrc')
    const ESLintConfig = JSON.parse(readFileSync(ESLintPath), 'utf8')



    
    //Update project JSONs
    const exampleDirPathFromRoot = relative(PATHS.root, PATHS.demoProject)
    let pathToIndex = devCorePackageConfig.index.replace(exampleDirPathFromRoot, '')
    pathToIndex = pathToIndex.substr(pathToIndex.search(/\w/))
    

    for (const command in devCorePackageScripts) {
        devCorePackageScripts[command] = devCorePackageScripts[command]
            .replace('$npm_package_config_index', pathToIndex)
    }
    targetPackageJSON.scripts = devCorePackageScripts;
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