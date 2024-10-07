'use strict'

import type { JestConfigWithTsJest } from 'ts-jest'


//TODO typing blocked by https://github.com/facebook/jest/issues/12952
// console.log(import.meta)

const jestOptions: JestConfigWithTsJest = {
    preset: 'ts-jest/presets/default-esm',
    rootDir: './',
    testMatch: [ '**/*.test.ts' ]
}


export default jestOptions