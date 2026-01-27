import https, { RequestOptions } from 'https'
import path from 'path'
import fs from 'fs'

import { PATHS } from '../../../core/constants.js'
import { isRunDirectly } from '../../../core/utils'
import { siegelPackageJsonData } from '../constants.js'

import type { GitRepoMetadataResponse, GitDownloadDirFilter } from './types'


const gitHost = 'api.github.com'
const repoUser = 'cybercookie'

const REPO_CONTENT_PATH
    = `https://${gitHost}/repos/${repoUser}/${siegelPackageJsonData.packageName}/contents/`


function gitRequest<Res>(
    href: string,
    json: boolean,
    cb: (res: Res) => void
) {

    const { hostname, pathname } = new URL(href)

    const headers: RequestOptions['headers'] = {
        'user-agent': 'Siegel framework'
    }
    if (json) {
        headers['content-type'] = 'application/json'
    }

    https.get({
        hostname, headers,
        path: pathname
    }, res => {

        let result = ''
        res.on('data', chunk => {
            result += chunk
        })

        res.on('end', () => {
            const repoMetadata: Res = json
                ?   JSON.parse(result)
                :   result

            cb(repoMetadata)
        })

        res.on('error', console.error)
    })
}


function downloadAndSave(
    repoMetadata: GitRepoMetadataResponse,
    savePath: string,
    filter: GitDownloadDirFilter | undefined
) {

    repoMetadata.forEach(({ name, path: gitPath, type, download_url }) => {
        const newSavePath = path.join(savePath, name)

        if (type == 'dir') {
            fs.mkdirSync(newSavePath)

            gitRequest<GitRepoMetadataResponse>(
                `${REPO_CONTENT_PATH}${gitPath}`,
                true,
                res => { downloadAndSave(res, newSavePath, filter) })

        } else if (!filter || filter(gitPath)) {
            gitRequest<string>(download_url, false, res => {
                fs.writeFile(newSavePath, res, err => {
                    err && console.error(err)
                })
            })
        }
    })
}

function main(
    dirName: string,
    filter?: GitDownloadDirFilter
) {

    gitRequest<GitRepoMetadataResponse>(
        `${REPO_CONTENT_PATH}${dirName}`,
        true,
        res => { downloadAndSave(res, PATHS.CWD, filter) }
    )
}


if (isRunDirectly(import.meta)) {
    main('')
}


export default main