type PackageJson = {
    version: string
    name: string
    type: string
    config: {
        boot: string
    }
    scripts: Obj<string>
    engines: {
        node: string
        npm: string
    }
}


export type { PackageJson }
export type { TSConfig } from './utils/modify_ts_configs'