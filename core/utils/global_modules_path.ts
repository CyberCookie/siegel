import { execSync as shell } from 'child_process'


const globalNodeModulesPath = () => `${shell('npm root -g')}`.trim()


export default globalNodeModulesPath