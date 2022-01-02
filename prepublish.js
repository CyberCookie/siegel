//@ts-nocheck
'use strict'

const fs    = require('fs')
const path  = require('path')
const shell = require('child_process').execSync
const esbuild = require('esbuild')

const { PATHS, LOC_NAMES, DEFAULT_CONFIG } = require('./src/constants')


console.time('transpilation took')

transpileSrcTS()
transpileClientCoreTS()

console.timeEnd('transpilation took')

function transpileSrcTS() {
    console.log('Creating cjs...')

    const cjsDirParh = path.join(PATHS.cwd, 'cjs')
    fs.existsSync(cjsDirParh) && fs.rmdirSync(cjsDirParh, { recursive: true })

    shell(`npx tsc -p ${LOC_NAMES.SRC_DIR_NAME}`)
}


function iterateFiles(dirPath, cb) {
    fs.readdirSync(dirPath, { withFileTypes: true })
        .forEach(dirent => {
            const { name } = dirent
            const nextDirPath = path.join(dirPath, name)

            dirent.isDirectory()
                ?   iterateFiles(nextDirPath, cb)
                :   cb(nextDirPath)
        })
}

function transpileClientCoreTS() {
    console.log('Creating lib...')

    const OUTPUT_CLIENT_CORE_PATH = path.join(PATHS.cwd, LOC_NAMES.CLIENT_CORE_OUTPUT_DIR_NAME)
    fs.existsSync(OUTPUT_CLIENT_CORE_PATH) && fs.rmdirSync(OUTPUT_CLIENT_CORE_PATH, { recursive: true })

    shell(`npx tsc -p ${LOC_NAMES.CLIENT_CORE_DIR_NAME}`)


    iterateFiles(PATHS.clientCore, fileNamePath => {
        if (fileNamePath.endsWith('.d.ts')) {
            const destinationFileName = fileNamePath.replace(LOC_NAMES.CLIENT_CORE_DIR_NAME, LOC_NAMES.CLIENT_CORE_OUTPUT_DIR_NAME)

            fs.createReadStream(fileNamePath)
                .pipe(fs.createWriteStream(destinationFileName))
        }
    })

    iterateFiles(OUTPUT_CLIENT_CORE_PATH, fileNamePath => {
        if (fileNamePath.endsWith('.js')) {
            const notMinifiedJSFile = fs.readFileSync(fileNamePath, 'utf8')
            const minified = esbuild.transformSync(notMinifiedJSFile, {
                minify: true,
                target: DEFAULT_CONFIG.build.target
            })
            fs.writeFileSync(fileNamePath, minified.code)
        }
    })
}

/// <reference path="../../global.d.ts" />