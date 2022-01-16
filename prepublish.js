'use strict'

import fs from 'fs'
import { execSync as shell } from 'child_process'
import esbuild from 'esbuild'


import { PATHS, LOC_NAMES, DEFAULT_CONFIG } from './src/constants.js'


// const PREPUBLISH_PATHS = {
//     siegelTsNodeOutput: `${PATHS.root}/${LOC_NAMES.SRC_OUTPUT}`
// }


// transpileSrcTS()
transpileClientCoreTS()


// function transpileSrcTS() {
//     console.log('Creating cjs...')

//     fs.existsSync(PREPUBLISH_PATHS.siegelTsNodeOutput)
//         && fs.rmdirSync(PREPUBLISH_PATHS.siegelTsNodeOutput, { recursive: true })

//     shell(`npx tsc -p ${LOC_NAMES.SRC_DIR_NAME}`)
// }


function iterateFiles(dirPath, cb) {
    fs.readdirSync(dirPath, { withFileTypes: true })
        .forEach(dirent => {
            const { name } = dirent
            const nextDirPath = `${dirPath}/${name}`

            dirent.isDirectory()
                ?   iterateFiles(nextDirPath, cb)
                :   cb(nextDirPath)
        })
}

function transpileClientCoreTS() {
    console.log('Creating lib...')

    fs.existsSync(PATHS.clientCoreOutput)
        && fs.rmSync(PATHS.clientCoreOutput, { recursive: true })
    console.log(1)
    shell(`npx tsc -p ${LOC_NAMES.CLIENT_CORE_DIR_NAME}`)

console.log(2)
    iterateFiles(PATHS.clientCore, fileNamePath => {
        if (fileNamePath.endsWith('.d.ts') || fileNamePath.endsWith('.sass')) {
            const destinationFileName = fileNamePath.replace(
                LOC_NAMES.CLIENT_CORE_DIR_NAME,
                LOC_NAMES.CLIENT_CORE_OUTPUT_DIR_NAME
            )

            fs.createReadStream(fileNamePath)
                .pipe(fs.createWriteStream(destinationFileName))
        }
    })
    console.log(3)
    iterateFiles(PATHS.clientCoreOutput, fileNamePath => {
        if (fileNamePath.endsWith('.js')) {
            const notMinifiedJSFile = fs.readFileSync(fileNamePath, 'utf8')
            const minified = esbuild.transformSync(notMinifiedJSFile, {
                minify: true,
                target: DEFAULT_CONFIG.build.output.target
            })
            fs.writeFileSync(fileNamePath, minified.code)
        }
    })
    console.log(4)
}

//<reference path="../../global.d.ts" />