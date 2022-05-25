'use strict'

import fs from 'fs'
import path from 'path'
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

// const matchImportStringRegExp = /import .* from/g



function iterateFiles(dirPath, cb) {
    fs.readdirSync(dirPath, { withFileTypes: true })
        .forEach(dirent => {
            const { name } = dirent
            const nextDirPath = `${dirPath}/${name}`

            dirent.isDirectory()
                ?   iterateFiles(nextDirPath, cb)
                :   cb(nextDirPath, dirPath)
        })
}

function transpileClientCoreTS() {
    console.log('Creating lib...')
    const addExtensionToImportRegExp = /(import|export .* from\s+['"])(.*\/.*)(?<![.]\w*)(?=['"])/g

    fs.existsSync(PATHS.clientCoreOutput)
        && fs.rmSync(PATHS.clientCoreOutput, { recursive: true })

    shell(`npx tsc -p ${LOC_NAMES.CLIENT_CORE_DIR_NAME}`)


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

    iterateFiles(PATHS.clientCoreOutput, (fileNamePath, dirPath) => {
        if (fileNamePath.endsWith('.js')) {
            let notMinifiedJSFile = fs.readFileSync(fileNamePath, 'utf8')

            const matchIterator = notMinifiedJSFile.matchAll(addExtensionToImportRegExp)
            for (const matchedGroups of matchIterator) {

                const [ , _import, importPath ] = matchedGroups

                const importPathResolved = path.join(dirPath, importPath)
                const isDirectory = fs.existsSync(importPathResolved) && fs.lstatSync(importPathResolved).isDirectory()

                const replace = _import + importPath
                const replaceWith = replace + (isDirectory ? '/index.js' : '.js')

                notMinifiedJSFile = notMinifiedJSFile.replace(replace, replaceWith)
            }

            const minified = esbuild.transformSync(notMinifiedJSFile, {
                minify: true,
                target: DEFAULT_CONFIG.build.output.target
            })
            fs.writeFileSync(fileNamePath, minified.code)
        }
    })
}

//<reference path="../../global.d.ts" />