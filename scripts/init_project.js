const { join, relative } = require('path')
const fs = require('fs')


const pckgJSON = 'package.json'
const cwd = process.cwd()
const targetPackageJSONPath = join(cwd, pckgJSON)


if (fs.existsSync(targetPackageJSONPath)) {
    const shell = require('child_process').execSync;
    const { PATHS } = require('../constants')


    const toJSON = data => JSON.stringify(data, null, 4)
    const replaceDevPathWithModule = path => path.replace('..', n/*devCorePackageJSON.name*/)

    
    //Copy test project
    shell(`mkdir -p ${cwd}`)
    shell(`cp -r ${PATHS.example}/. ${cwd}`)



    const devCorePackageJSON = require(join(PATHS.root, pckgJSON))
    const n = '../Oswell-Webapp-template' || devCorePackageJSON.name;

    const targetPackageJSON = require(targetPackageJSONPath)

    const TSPath = join(cwd, 'tsconfig.json')
    const TSConfig = require(TSPath)

    const ESLintPath = join(cwd, '.eslintrc')
    const ESLintConfig = JSON.parse(fs.readFileSync(ESLintPath), 'utf8')



 
    //Update project JSONs
    const exampleDirPathFromRoot = relative(PATHS.root, PATHS.example)
    let indexVar = devCorePackageJSON.config.index.replace(exampleDirPathFromRoot, '')
    indexVar = indexVar.substr(indexVar.search(/\w/))
    
    targetPackageJSON.config = { index: indexVar }
    targetPackageJSON.scripts = devCorePackageJSON.scripts;
    fs.writeFileSync(targetPackageJSONPath, toJSON(targetPackageJSON))
    
    
    
    
    TSConfig.extends = replaceDevPathWithModule(TSConfig.extends)
    
    const paths = TSConfig.compilerOptions.paths;
    for (const alias in paths) {
        paths[alias][0] = replaceDevPathWithModule(paths[alias][0])
    }
    paths['react/*'] = [ n + '/node_modules/react/*' ]
    
    fs.writeFileSync(TSPath, toJSON(TSConfig))
    
    
    
    
    ESLintConfig.extends = replaceDevPathWithModule(ESLintConfig.extends[0])
    fs.writeFileSync(ESLintPath, toJSON(ESLintConfig))
    
    
    
    //Run
    process.argv.includes('--run') && shell('npm run dev', { stdio: 'inherit' })
} else {
    console.error('%s wasn`t found in current dir', pckgJSON)
    process.exitCode = 1
}