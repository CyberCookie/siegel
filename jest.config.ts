'use strict'

import type { InitialOptionsTsJest } from 'ts-jest'

//TODO typing:
// console.log(import.meta)

const jestOptions: InitialOptionsTsJest = {
    preset: 'ts-jest/presets/default-esm',
    rootDir: './common',
    testMatch: [ '**/*.test.ts' ]
}

export default jestOptions