const { join, relative, posix }                     = require('path')
const { existsSync, writeFileSync, readFileSync }   = require('fs')

const { PATHS }                                     = require('../src/constants')


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

    const TSNodePath = join(cwd, 'src', 'tsconfig.json')
    shell(`cp ${TSNodePath} ./server`)
    
    
    existsSync(PATHS.cwdPackageJSON) || shell('npm init -y')
    const targetPackageJSON = require(PATHS.cwdPackageJSON)
        
    const TSPath = join(cwd, 'tsconfig.json')
    const TSConfig = require(TSPath)

    const ESLintPath = join(cwd, '.eslintrc')
    const ESLintConfig = JSON.parse(readFileSync(ESLintPath), 'utf8')



    
    //Update project JSONs
    const demoDirPathFromRoot = relative(PATHS.root, PATHS.demoProject)
    let pathToIndex = devCorePackageConfig.index.replace(demoDirPathFromRoot, '')
    pathToIndex = pathToIndex.substr(pathToIndex.search(/\w/))
    

    for (const command in siegelPackageJSONScripts) {
        let siegelPackageJSONCommand = siegelPackageJSONScripts[command]

        if (command == 'build_node') {
            siegelPackageJSONScripts[command] = siegelPackageJSONCommand.replace('src', 'server')
        } else {
            const replaceWith = command == 'pm2' ? 'cjs' : pathToIndex;
            siegelPackageJSONScripts[command] = siegelPackageJSONCommand.replace('$npm_package_config_index', replaceWith)
        }
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


require.main == module
    ?   main()
    :   (module.exports = main)