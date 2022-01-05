const {
    LOC_NAMES: { CLIENT_CORE_DIR_NAME }
} = require('./src/constants')


/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    rootDir: CLIENT_CORE_DIR_NAME,
    testMatch: [ `**/${ CLIENT_CORE_DIR_NAME }/**/*.test.ts` ]
}