import Bun from 'bun'
import fs from 'fs'
import path from 'path'
import childProcess from 'child_process'
import TerserWebpackPlugin from 'terser-webpack-plugin'

import { LOC_NAMES, PATHS } from './core/constants'

import type { JsMinifyOptions } from '@swc/core'


const { swcMinify } = TerserWebpackPlugin

const {
    BIN, SRC, LIB_OUTPUT,
    CLIENT_CORE, CLIENT_CORE_OUTPUT,
    SHARED_UTILS, SHARED_UTILS_OUTPUT,
    DEMO_PROJECT, DEMO_MINI_PROJECT
} = PATHS

const LIB_FOLDERS_TO_MINIFY = [ CLIENT_CORE_OUTPUT, SHARED_UTILS_OUTPUT ]
const LIB_FOLDERS = [ BIN, CLIENT_CORE, SRC, SHARED_UTILS ]
const DEMO_FOLDERS = [ DEMO_MINI_PROJECT ]

const isMinify = false


const foldersToTSCCommands = () => {
    let folders = LIB_FOLDERS
    let modifiers = '--pretty'

    if (isMinify) {
        folders = folders.concat(DEMO_FOLDERS)
        modifiers += ' --noEmit false'
    }

    return folders.map(folderName => (
        `npx tsc -p ${path.relative(__dirname, folderName)}/${LOC_NAMES.TS_JSON} ${modifiers}`
    ))
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



    isMinify
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
                    console.log(`COMMAND ${command} FAILED:`)
                    console.error(stdout)
                    process.exitCode = 1

                    rej(new Error)

                } else {
                    console.log(`COMMAND ${command} SUCCESS`)
                    res(true)
                }
            })
        })
    ))
)
.then(async () => {
    isMinify && await runMinifier()
})
.finally(() => {
    process.exit()
})