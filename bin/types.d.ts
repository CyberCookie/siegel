import type { CLIParamsValuesType } from '../core/utils/parse_cli_args'
import type { ConfigObject } from '../core/types'


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
        config: ConfigObject
    }>
    init: CommandObj<{
        isMini: boolean
        isMiniServ: boolean
    }>
    'create-ssl-certs': CommandObj<undefined>
    version: CommandObj<undefined>
}
type Command = keyof CommanTree
type ALlCommands = CommanTree[Command]
type CommandsWithParams = Extract<ALlCommands, CommandWithParams<any>>


export type {
    Command, ALlCommands, CommanTree, CommandsWithParams,
    PrintHelpFlagsMap, CommandExampleFn
}