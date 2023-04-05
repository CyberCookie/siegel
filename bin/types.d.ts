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
} & (R extends undefined ? {} : CommandWithParams<R>)

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



export type {
    FullCommand, CommanTree,
    PrintHelpFlagsMap, CommandExampleFn
}