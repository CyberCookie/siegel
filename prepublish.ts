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


function normalizeImportPathsAndMinify(iterateOverDirPath: string, isMinify = true) {
    const addExtensionToImportRegExp = /((import|export) .* from\s+['"])((.*\/.*)(?<![.]\w*))(?=['"])/g

    iterateFiles(iterateOverDirPath, (fileNamePath, dirPath) => {
        if (fileNamePath.endsWith('.js')) {
            let notMinifiedJSFile = fs.readFileSync(fileNamePath, 'utf8')

            const matchIterator = notMinifiedJSFile.matchAll(addExtensionToImportRegExp)
            for (const matchedGroups of matchIterator) {

                const [ , _import, , importPath ] = matchedGroups

                const importPathResolved = path.join(dirPath, importPath)
                const isDirectory = fs.existsSync(importPathResolved) && fs.lstatSync(importPathResolved).isDirectory()

                //TODO: fix case with @pmmmwh/react-refresh-webpack-plugin.js
                const replace = _import + importPath
                const replaceWith = replace + (
                    isDirectory
                        ?   `${replace.endsWith('/') ? '' : '/'}index.js`
                        :   '.js'
                )

                notMinifiedJSFile = notMinifiedJSFile.replace(replace, replaceWith)
            }


            const resultCode = isMinify
                ?   esbuild.transformSync(notMinifiedJSFile, {
                        minify: true,
                        target: DEFAULT_CONFIG.build.output.target
                    }).code
                :   notMinifiedJSFile


            fs.writeFileSync(fileNamePath, resultCode)
        }
    })
}



shell('npx tsc -p .')


copyTypes(PATHS.clientCore)
normalizeImportPathsAndMinify(PATHS.clientCoreOutput)

copyTypes(PATHS.sharedUtils)
normalizeImportPathsAndMinify(PATHS.sharedUtilsOutput)

// copyTypes(PATHS.src)
// normalizeImportPathsAndMinify(PATHS.srcOutput, false)

// normalizeImportPathsAndMinify(PATHS.binOutput, false)