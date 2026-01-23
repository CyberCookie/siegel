import https, { RequestOptions } from 'https'
import path from 'path'
import fs from 'fs'

import { PATHS, LOC_NAMES } from '../core/constants.js'
import { isRunDirectly, requireJSON } from '../core/utils'

import type { PackageJson } from './types'


type GitDir = {
    type: 'dir'
    download_url: null
}
type GitFile = {
    type: 'file'
    download_url: string
}
type GitEntityMetadata = ({
    name: string
    path: string
    sha: string
    size: number
    html_url: string
    git_url: string
} & (GitDir | GitFile))
type GitRepoMetadataResponse = GitEntityMetadata[]



const gitHost = 'api.github.com'
const repoUser = 'cybercookie'
const repoName = (requireJSON(PATHS.packageJSON) as PackageJson).name

const REPO_CONTENT_PATH = `https://${gitHost}/repos/${repoUser}/${repoName}/contents/`


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


function downloadAndSave(repoMetadata: GitRepoMetadataResponse, savePath: string) {
    repoMetadata.forEach(({ name, path: gitPath, type, download_url }) => {
        const newSavePath = path.join(savePath, name)

        if (type == 'dir') {
            fs.mkdirSync(newSavePath)
            console.log('Created: ', newSavePath)

            gitRequest<GitRepoMetadataResponse>(
                `${REPO_CONTENT_PATH}${gitPath}`,
                true,
                res => { downloadAndSave(res, newSavePath) })

        } else {
            gitRequest<string>(download_url, false, res => {
                fs.writeFile(newSavePath, res, err => {
                    err
                        ?   console.error(err)
                        :   console.log('Created: ', newSavePath)
                })
            })
        }
    })
}

function main() {
    gitRequest<GitRepoMetadataResponse>(
        `${REPO_CONTENT_PATH}${LOC_NAMES.DEMO_APP_DIR_NAME}`,
        true,
        res => { downloadAndSave(res, PATHS.cwd) }
    )
}


isRunDirectly(import.meta) && main()


export default main