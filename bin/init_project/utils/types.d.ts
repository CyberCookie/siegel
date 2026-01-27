import type { CompilerOptions } from 'typescript'


type TSConfig = {
    extends: string
    compilerOptions: CompilerOptions
    include: string[]
}
type ModifyTSConfigsParams = {
    DEMO_APP_PATH_SHIFT: string
    USER_TS_CONFIG_PATH: string
    USER_SERVER_PATH?: string
}



type ModifyServerPathsParams = {
    DEMO_PROJECT_SERVER_PATH: string
    PATHS_TO_UPDATE: string[]
}



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

type GitDownloadDirFilter = (path: GitEntityMetadata['path']) => boolean


export type {
    TSConfig, ModifyTSConfigsParams, ModifyServerPathsParams,
    GitRepoMetadataResponse, GitDownloadDirFilter
}