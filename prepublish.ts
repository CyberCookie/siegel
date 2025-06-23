'use strict'

import fs from 'fs'
import path from 'path'
import { execSync as shell } from 'child_process'
import TerserWebpackPlugin from 'terser-webpack-plugin'

import { PATHS, LOC_NAMES } from './core/constants.js'

import type { JsMinifyOptions } from '@swc/core'


const { swcMinify } = TerserWebpackPlugin


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


const addExtensionToImportRegExp = /((import|export) .* from\s+['"])(?!@)((.*\/.*)(?<![.]\w*))(?=['"])/g

function normalizeImportPathsAndMinify(iterateOverDirPath: string, isMinify = true) {
    iterateFiles(iterateOverDirPath, async (fileNamePath, dirPath) => {
        if (fileNamePath.endsWith('.js')) {
            let notMinifiedJSFile = fs.readFileSync(fileNamePath, 'utf8')

            const matchIterator = notMinifiedJSFile.matchAll(addExtensionToImportRegExp)
            for (const matchedGroups of matchIterator) {

                const [ , _import, , importPath ] = matchedGroups

                const importPathResolved = path.join(dirPath, importPath)
                const isDirectory = fs.existsSync(importPathResolved) && fs.lstatSync(importPathResolved).isDirectory()

                const replace = _import + importPath
                const replaceWith = replace + (
                    isDirectory
                        ?   `${replace.endsWith('/') ? '' : '/'}index.js`
                        :   '.js'
                )

                notMinifiedJSFile = notMinifiedJSFile.replace(replace, replaceWith)
            }


            const resultCode = isMinify
                ?   (await swcMinify(
                        { [fileNamePath]: notMinifiedJSFile },
                        undefined,
                        {
                            module: true
                        } satisfies JsMinifyOptions
                    )).code
                :   notMinifiedJSFile


            fs.writeFileSync(fileNamePath, resultCode)
        }
    })
}



shell('npx tsc -p .')


copyTypes(PATHS.clientCore)
normalizeImportPathsAndMinify(PATHS.clientCoreOutput, false)

// copyTypes(PATHS.sharedUtils)
// normalizeImportPathsAndMinify(PATHS.sharedUtilsOutput)

// copyTypes(PATHS.src)
// normalizeImportPathsAndMinify(PATHS.srcOutput, false)

// normalizeImportPathsAndMinify(PATHS.binOutput, false)