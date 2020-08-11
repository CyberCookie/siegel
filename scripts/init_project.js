const path = require('path')
const fs = require('fs')
const shell = require('child_process').execSync;

const shellOptions = { stdio: 'inherit' }
const scriptArguments = process.argv;



//Copy test project
const from = path.join(__dirname, '..', '__example')
const to = path.join(process.cwd(), scriptArguments[2])

shell(`mkdir -p ${to}`)
shell(`cp -r ${from}/. ${to}`)



//Update tsconfig.json and .eslintrc
const packageJSON = require('../package.json')
const n = '../Oswell-Webapp-template' || packageJSON.name
const replaceDevPathWithModule = path => path.replace('..', n/*packageJSON.name*/)



const TSPath = path.join(to, 'tsconfig.json')
const TSConfig = require(TSPath)

TSConfig.extends = replaceDevPathWithModule(TSConfig.extends)

const paths = TSConfig.compilerOptions.paths;
for (const alias in paths) {
    paths[alias][0] = replaceDevPathWithModule(paths[alias][0])
}
paths['react/*'] = [ n + '/node_modules/react/*' ]
paths['react-router-dom/*'] = [ n + '/node_modules/react-router-dom/*' ]

fs.writeFileSync(TSPath, JSON.stringify(TSConfig, null, 4))




const ESLintPath = path.join(to, '.eslintrc')
const ESLintConfig = JSON.parse(fs.readFileSync(ESLintPath), 'utf8')

ESLintConfig.extends = replaceDevPathWithModule(ESLintConfig.extends[0])

fs.writeFileSync(ESLintPath, JSON.stringify(ESLintConfig, null, 4))



//Install add the peerDependencies
// if (scriptArguments.includes('--install')) {
//     const peerDepsInstallRow = 'npm i -D ' + Object.keys(packageJSON.peerDependencies).join(' ')
//     shell(peerDepsInstallRow, shellOptions)
// }



//Run
scriptArguments.includes('--run') && shell('npm run dev', shellOptions)