import type { CompilerOptions } from 'typescript'


type PackageJson = {
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

type TSConfig = {
    extends: string
    compilerOptions: CompilerOptions
    include: string[]
}


export type { PackageJson, TSConfig }