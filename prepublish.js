//@ts-nocheck
'use strict'

const fs    = require('fs')
const shell = require('child_process').execSync
const esbuild = require('esbuild')

const { PATHS, LOC_NAMES, DEFAULT_CONFIG } = require('./src/constants')


const PREPUBLISH_PATHS = {
    siegelTsNodeOutput: `${PATHS.root}/${LOC_NAMES.SRC_OUTPUT}`
}


console.time('transpilation took')

transpileSrcTS()
transpileClientCoreTS()

console.timeEnd('transpilation took')


function transpileSrcTS() {
    console.log('Creating cjs...')

    fs.existsSync(PREPUBLISH_PATHS.siegelTsNodeOutput)
        && fs.rmdirSync(PREPUBLISH_PATHS.siegelTsNodeOutput, { recursive: true })

    shell(`npx tsc -p ${LOC_NAMES.SRC_DIR_NAME}`)
}


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
        && fs.rmdirSync(PATHS.clientCoreOutput, { recursive: true })

    shell(`npx tsc -p ${LOC_NAMES.CLIENT_CORE_DIR_NAME}`)


    iterateFiles(PATHS.clientCore, fileNamePath => {
        if (fileNamePath.endsWith('.d.ts') || fileNamePath.endsWith('.sass')) {
            const destinationFileName = fileNamePath.replace(LOC_NAMES.CLIENT_CORE_DIR_NAME, LOC_NAMES.CLIENT_CORE_OUTPUT_DIR_NAME)

            fs.createReadStream(fileNamePath)
                .pipe(fs.createWriteStream(destinationFileName))
        }
    })

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
}

//<reference path="../../global.d.ts" />