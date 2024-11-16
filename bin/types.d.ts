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

type CommandObj<R extends Obj | undefined> = {
    description: string
    commandAction(params: ActionParam<R>): void
    example?: boolean | string | CommandExampleFn
} & (R extends undefined ? object : CommandWithParams<R>)


type CommanTree = {
    run: CommandObj<{
        config: ConfigDefault
        runParams: RunParamsFinal
        providedConfigNormalized?: ConfigFinal
    }>
    init: CommandObj<{
        isGlobal: boolean
        isMini: boolean
    }>
    'create-ssl': CommandObj<undefined>
    version: CommandObj<undefined>
}
type Command = keyof CommanTree
type ALlCommands = CommanTree[Command]
type CommandsWithParams = Extract<ALlCommands, CommandWithParams<any>>


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
    PackageJson, ALlCommands, CommanTree, CommandsWithParams,
    PrintHelpFlagsMap, CommandExampleFn, Command
}