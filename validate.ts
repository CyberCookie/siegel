import Bun from 'bun'
import fs from 'fs'
import path from 'path'
import childProcess from 'child_process'
import TerserWebpackPlugin from 'terser-webpack-plugin'

import { PATHS } from './core/constants'
import { getColored } from './bin/utils'

import type { JsMinifyOptions } from '@swc/core'


const IS_TRANSPILE = process.argv.includes('-t')

const { swcMinify } = TerserWebpackPlugin

const {
    BIN, SRC, LIB_OUTPUT,
    CLIENT_CORE, CLIENT_CORE_OUTPUT,
    SHARED_UTILS, SHARED_UTILS_OUTPUT,
    DEMO_MINI_PROJECT, DEMO_PROJECT
} = PATHS

const LIB_FOLDERS_TO_MINIFY = [ CLIENT_CORE_OUTPUT, SHARED_UTILS_OUTPUT ]
const LIB_FOLDERS = [ BIN, CLIENT_CORE, SRC, SHARED_UTILS ]
const DEMO_FOLDERS = [
    DEMO_MINI_PROJECT,
    DEMO_PROJECT + '/client',
    DEMO_PROJECT + '/server'
]

const getCommand = (folderName: string, modifiers: string) => (
    `npx tsc -p ${path.relative(__dirname, folderName)} ${modifiers}`
)
const foldersToTSCCommands = () => {
    const modifiers = '--pretty'
    const resultCommands = DEMO_FOLDERS.map(demoFolderName => getCommand(demoFolderName, modifiers))


    const libModifiers = IS_TRANSPILE
        ?   `${modifiers} --noEmit false`
        :   modifiers

    LIB_FOLDERS.forEach(folderName => {
        resultCommands.push(
            getCommand(folderName, libModifiers)
        )
    })


    return resultCommands
}

async function iterateFiles(dirPath: string, cb: (nextDir: string, curDir: string) => void) {
    const dirents = fs.readdirSync(dirPath, { withFileTypes: true })

    for (const dirent of dirents) {
        const { name } = dirent
        const nextDirPath = `${dirPath}/${name}`

        dirent.isDirectory()
            ?   await iterateFiles(nextDirPath, cb)
            :   nextDirPath.endsWith('.js') && await cb(nextDirPath, dirPath)
    }
}

async function runMinifier() {
    for (const folderToMinify of LIB_FOLDERS_TO_MINIFY) {
        await iterateFiles(folderToMinify, async fileName => {

            // Should be removed when move from webpack to pure bun build
            // const output = await Bun.$`npx esbuild ${fileName} --minify-whitespace --minify-syntax --minify-identifiers`.text()
            // await Bun.write(fileName, output)


            // const output = await Bun.build({
            //     entrypoints: [ fileName ],
            //     minify: true
            // })
            // console.log('fileName: ', output.outputs)
            // const minifiedBuffer = await output.outputs[0].arrayBuffer()
            // await Bun.write(fileName, minifiedBuffer)

            const result = (await swcMinify(
                { [fileName]: await Bun.file(fileName).text() },
                undefined,
                {
                    module: true
                    // compress: {
                    //     reduce_vars: false,
                    //     hoist_props: false
                    // },
                    // mangle: {
                    //     keep_classnames: true,
                    //     keep_fnames: true
                    // }
                } satisfies JsMinifyOptions
            )).code

            result
                ?   await Bun.write(fileName, result)
                :   console.log(`No minify result for ${fileName}`)
        })
    }
}



    IS_TRANSPILE
&&  fs.existsSync(LIB_OUTPUT)
&&  await fs.promises.rm(LIB_OUTPUT, {
        recursive: true,
        force: true
    })


Promise.all(
    foldersToTSCCommands().map(command => (
        new Promise((res, rej) => {
            childProcess.exec(command, (error, stdout) => {

                if (error) {
                    console.log(`COMMAND ${command} ${getColored(31, 'FAILED')}`)
                    console.error(stdout)
                    process.exitCode = 1

                    rej(new Error)

                } else {
                    console.log(`COMMAND ${command} ${getColored(32, 'SUCCESS')}`)
                    res(true)
                }
            })
        })
    ))
)
.then(async () => {
    IS_TRANSPILE && await runMinifier()
})
.finally(() => {
    process.exit()
})