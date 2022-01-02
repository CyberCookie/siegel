const { LOC_NAMES } = require('./src/constants')


/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    rootDir: LOC_NAMES.CLIENT_CORE_DIR_NAME,
    testMatch: [ `**/${ LOC_NAMES.CLIENT_CORE_DIR_NAME }/**/*.test.ts` ]
}