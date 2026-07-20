import { relative } from 'path'
import { exec } from 'child_process'

import { LOC_NAMES, PATHS } from './core/constants'


const { BIN, CLIENT_CORE, SRC, SHARED_UTILS, DEMO_PROJECT, DEMO_MINI_PROJECT } = PATHS


const LIB_FOLDERS = [ BIN, CLIENT_CORE, SRC, SHARED_UTILS ]
const DEMO_FOLDERS = [ DEMO_PROJECT, DEMO_MINI_PROJECT ]



const foldersToTSCCommands = (folders: string[]) => (
    folders.map(folderName => (
        `npx tsc -p ./${relative(__dirname, folderName)}/${LOC_NAMES.TS_JSON} --pretty`
    ))
)


const isValidateOnly = true
if (isValidateOnly) {
    foldersToTSCCommands(LIB_FOLDERS.concat(DEMO_FOLDERS))
        .forEach(command => {
            exec(command, (error, stdout) => {
                if (error) {
                    console.log(`COMMAND ${command} FAILED:`)
                    console.error(stdout)
                    process.exitCode = 1
                }
            })
        })

} else {
    console.log(23)
}