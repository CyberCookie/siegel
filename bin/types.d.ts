import type { CLIParamsValuesType } from '../core/utils/parse_cli_args'
import type { ConfigDefault, ConfigFinal, RunParamsFinal } from '../core/types'


type ActionParam<R> = {
    result: R
    CLIParamsValues: CLIParamsValuesType
}



type CommanParam<R> = {
    description: string
    paramAction(
        params: {
            value: NonNullable<CLIParamsValuesType[string]>['value']
        } & ActionParam<R>
    ): void
    flagLong: string
    flag?: string
    defaultValue?: any
}

type CommandWithParams<R> = {
    prepareResult(): R
    params: CommanParam<R>[]
}

type PrintHelpFlagsMap = Obj<{
    flag: CommanParam<any>['flag']
    flagLong: CommanParam<any>['flagLong']
}>

type CommandExampleFn = (
    command: string,
    flags: PrintHelpFlagsMap
) => string

type Command<R extends Obj | undefined> = {
    description: string
    commandAction(params: ActionParam<R>): void
    example?: boolean | string | CommandExampleFn
} & (R extends undefined ? object : CommandWithParams<R>)

type FullCommand = Command<Obj>


type CommanTree = {
    run: Command<{
        config: ConfigDefault
        runParams: RunParamsFinal
        providedConfigNormalized?: ConfigFinal
    }>
    init: Command<{
        isGlobal: boolean
    }>
    'create-ssl': Command<undefined>
    version: Command<undefined>
}


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


export type {
    PackageJson, FullCommand, CommanTree,
    PrintHelpFlagsMap, CommandExampleFn
}