// import { LOC_NAMES } from './src/constants'
// console.log(LOC_NAMES)
// const { CLIENT_CORE_DIR_NAME } = LOC_NAMES

// /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// export default {
//     preset: 'ts-jest',
//     rootDir: CLIENT_CORE_DIR_NAME,
//     testMatch: [ `**/${ CLIENT_CORE_DIR_NAME }/**/*.test.ts` ]
// }





// /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// export default {
//     preset: 'ts-jest',
//     rootDir: './utils',
//     testMatch: [ './**/*.test.ts' ]
// }





// import path from 'path'

import type { InitialOptionsTsJest } from 'ts-jest'

// console.log(import.meta)

const jestOptions: InitialOptionsTsJest = {
    preset: 'ts-jest/presets/default-esm',
    rootDir: './common',
    testMatch: [ '**/*.test.ts' ]
    // ,extensionsToTreatAsEsm: ['.ts'],
    // moduleNameMapper: {
    //     '^(\\.{1,2}/.*)\\.js$': '$1'
    // },
    // globals: {
    //     'ts-jest': {
    //         useESM: true,
    //         tsconfig: path.join(process.cwd(), 'tsconfig.json')
    //     }
    // }
}

export default jestOptions