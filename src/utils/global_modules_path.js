import { execSync as shell } from 'child_process'


const globalNodeModulesPath = () => shell('npm root -g').toString().trim()


export default globalNodeModulesPath