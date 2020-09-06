const { join, relative, basename }                  = require('path')
const { existsSync, writeFileSync, readFileSync }   = require('fs')

const { PATHS }                                     = require('../constants')


const cwd = process.cwd()
const targetPackageFilename = basename(PATHS.package)
const targetPackageJSONPath = join(cwd, targetPackageFilename)


if (existsSync(targetPackageJSONPath)) {
    const shell = require('child_process').execSync;
    const {
        name: devCorePackageName,
        scripts: devCorePackageScripts,
        config: devCorePackageConfig
    } = require(PATHS.package)

    // const devCorePackageName = '../siegel'

    const toJSON = data => JSON.stringify(data, null, 4)
    const replaceDevPathWithModule = path => path.replace(
        '..',
        join('node_modules', devCorePackageName)
    )

    
    //Copy test project
    shell(`cp -r ${PATHS.example}/. .`)




    const targetPackageJSON = require(targetPackageJSONPath)

    const TSPath = join(cwd, 'tsconfig.json')
    const TSConfig = require(TSPath)

    const ESLintPath = join(cwd, '.eslintrc')
    const ESLintConfig = JSON.parse(readFileSync(ESLintPath), 'utf8')



 
    //Update project JSONs
    const exampleDirPathFromRoot = relative(PATHS.root, PATHS.example)
    let indexVar = devCorePackageConfig.index.replace(exampleDirPathFromRoot, '')
    indexVar = indexVar.substr(indexVar.search(/\w/))
    
    targetPackageJSON.config = { index: indexVar }
    targetPackageJSON.scripts = devCorePackageScripts;
    writeFileSync(targetPackageJSONPath, toJSON(targetPackageJSON))
    
    
    
    
    TSConfig.extends = replaceDevPathWithModule(TSConfig.extends)
    
    const paths = TSConfig.compilerOptions.paths;
    for (const alias in paths) {
        paths[alias][0] = replaceDevPathWithModule(paths[alias][0])
    }
    writeFileSync(TSPath, toJSON(TSConfig))
    
    
    
    
    ESLintConfig.extends = replaceDevPathWithModule(ESLintConfig.extends[0])
    writeFileSync(ESLintPath, toJSON(ESLintConfig))
    
    
    
    //install peers
    process.argv.includes('--peers') && require('./install_peers')

    //Run
    process.argv.includes('--run') && shell('npm run dev', { stdio: 'inherit' })
} else {
    console.error('%s wasn`t found in current dir', targetPackageFilename)
    process.exitCode = 1
}