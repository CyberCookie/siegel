import { LOC_NAMES } from './src/constants.js'


const { CLIENT_CORE_DIR_NAME } = LOC_NAMES


/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
    preset: 'ts-jest',
    rootDir: CLIENT_CORE_DIR_NAME,
    testMatch: [ `**/${ CLIENT_CORE_DIR_NAME }/**/*.test.ts` ]
}