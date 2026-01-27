import { readFileSync, writeFileSync } from 'fs'
import { relative } from 'path'

import { PATHS } from '../../../core/constants'
import { toPosixPath } from '../../../core/utils'
import { siegelPackageJsonData } from '../constants'

import type { ModifyServerPathsParams } from './types'


const { packageName } = siegelPackageJsonData

function modifyServerPaths(params: ModifyServerPathsParams) {
    const { DEMO_PROJECT_SERVER_PATH, PATHS_TO_UPDATE } = params

    const replaceStringPart = toPosixPath(
        relative(DEMO_PROJECT_SERVER_PATH, PATHS.SRC)
    )


    PATHS_TO_UPDATE.forEach(path => {
        const newFileContent = readFileSync(path, 'utf8')
            .replace(replaceStringPart, packageName)

        writeFileSync(path, newFileContent)
    })
}


export default modifyServerPaths