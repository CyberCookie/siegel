'use strict'

import fs from 'fs'
import path from 'path'
import { execSync as shell } from 'child_process'
import esbuild from 'esbuild'

import { PATHS, LOC_NAMES, DEFAULT_CONFIG } from './core/constants.js'



function iterateFiles(dirPath: string, cb: (nextDir: string, curDir: string) => void) {
    fs.readdirSync(dirPath, { withFileTypes: true })
        .forEach(dirent => {
            const { name } = dirent
            const nextDirPath = `${dirPath}/${name}`

            dirent.isDirectory()
                ?   iterateFiles(nextDirPath, cb)
                :   cb(nextDirPath, dirPath)
        })
}


function copyTypes(iterateOverDirPath: string) {
    const dirName = iterateOverDirPath.slice( iterateOverDirPath.lastIndexOf('/') + 1 )

    iterateFiles(iterateOverDirPath, fileNamePath => {
        if (fileNamePath.endsWith('.d.ts') || fileNamePath.endsWith('.sass')) {
            const destinationFileName = fileNamePath.replace(
                dirName,
                `${LOC_NAMES.LIB_OUTPUT_DIRNAME}/${dirName}`
            )

            fs.createReadStream(fileNamePath)
                .pipe(fs.createWriteStream(destinationFileName))
        }
    })
}


function normalizeImportPathsAndMinify(iterateOverDirPath: string) {
    const addExtensionToImportRegExp = /((import|export) .* from\s+['"])((.*\/.*)(?<![.]\w*))(?=['"])/g

    iterateFiles(iterateOverDirPath, (fileNamePath, dirPath) => {
        if (fileNamePath.endsWith('.js')) {
            let notMinifiedJSFile = fs.readFileSync(fileNamePath, 'utf8')

            const matchIterator = notMinifiedJSFile.matchAll(addExtensionToImportRegExp)
            for (const matchedGroups of matchIterator) {

                const [ , _import, , importPath ] = matchedGroups

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



shell('npx tsc -p .')

copyTypes(PATHS.clientCore)

normalizeImportPathsAndMinify(PATHS.clientCoreOutput)
normalizeImportPathsAndMinify(PATHS.sharedUtilsOutput)




// transpileUtilsCross()
// transpileSrcTS()
// transpileClientCoreTS()


// function transpileUtilsCross() {
//     console.log(`Creating ${LOC_NAMES.UTILS_OUTPUT_DIR_NAME}...`)

//     fs.existsSync(PATHS.sharedUtilsOutput)
//         && fs.rmdirSync(PATHS.sharedUtilsOutput, { recursive: true })

//     shell(`npx tsc -p ${LOC_NAMES.UTILS_DIR_NAME}`)
// }



// function transpileSrcTS() {
//     console.log(`Creating ${LOC_NAMES.SRC_OUTPUT_DIR_NAME}...`)

//     fs.existsSync(PATHS.srcOutput)
//         && fs.rmdirSync(PATHS.srcOutput, { recursive: true })

//     shell(`npx tsc -p ${LOC_NAMES.SRC_DIR_NAME}`)
// }



// function transpileClientCoreTS() {
//     console.log(`Creating ${LOC_NAMES.CLIENT_CORE_OUTPUT_DIR_NAME}...`)

//     const addExtensionToImportRegExp = /((import|export) .* from\s+['"])((.*\/.*)(?<![.]\w*))(?=['"])/g

//     fs.existsSync(PATHS.clientCoreOutput)
//         && fs.rmSync(PATHS.clientCoreOutput, { recursive: true })

//     shell(`npx tsc -p ${LOC_NAMES.CLIENT_CORE_DIR_NAME}`)


//     iterateFiles(PATHS.clientCore, fileNamePath => {
//         if (fileNamePath.endsWith('.d.ts') || fileNamePath.endsWith('.sass')) {
//             const destinationFileName = fileNamePath.replace(
//                 LOC_NAMES.CLIENT_CORE_DIR_NAME,
//                 LOC_NAMES.CLIENT_CORE_OUTPUT_DIR_NAME
//             )

//             fs.createReadStream(fileNamePath)
//                 .pipe(fs.createWriteStream(destinationFileName))
//         }
//     })

//     iterateFiles(PATHS.clientCoreOutput, (fileNamePath, dirPath) => {
//         if (fileNamePath.endsWith('.js')) {
//             let notMinifiedJSFile = fs.readFileSync(fileNamePath, 'utf8')

//             const matchIterator = notMinifiedJSFile.matchAll(addExtensionToImportRegExp)
//             for (const matchedGroups of matchIterator) {

//                 const [ , _import, , importPath ] = matchedGroups

//                 const importPathResolved = path.join(dirPath, importPath)
//                 const isDirectory = fs.existsSync(importPathResolved) && fs.lstatSync(importPathResolved).isDirectory()

//                 const replace = _import + importPath
//                 const replaceWith = replace + (isDirectory ? '/index.js' : '.js')

//                 notMinifiedJSFile = notMinifiedJSFile.replace(replace, replaceWith)
//             }

//             const minified = esbuild.transformSync(notMinifiedJSFile, {
//                 minify: true,
//                 target: DEFAULT_CONFIG.build.output.target
//             })
//             fs.writeFileSync(fileNamePath, minified.code)
//         }
//     })
// }