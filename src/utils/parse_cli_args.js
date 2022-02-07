function parseCommandLineArgs(args) {
    const CLIParamsValues = {}
    function addValueToCLIParams(key, value) {
        if (CLIParamsValues[key]) {
            CLIParamsValues[key].value = value
        } else {
            CLIParamsValues[key] = {
                value,
                resolved: false
            }
            unresolvedParamsCount++
        }
    }


    let commandValue
    let unresolvedParamsCount = 0
    for (let i = 0, l = args.length, prevCLIParam; i < l; i++) {
        const arg = args[i]
        const isValue = arg[0] != '-'

        if (isValue || arg[1] == '-') {
            if (isValue) {
                prevCLIParam
                    ?   addValueToCLIParams(prevCLIParam, arg)
                    :   (commandValue = arg)
            } else {
                addValueToCLIParams(arg, true)
                prevCLIParam = arg
            }
        } else if (arg.length > 2) {
            arg.split('').forEach((flag, index) => (
                index && addValueToCLIParams(`-${flag}`, true)
            ))
        } else {
            addValueToCLIParams(arg, true)
            prevCLIParam = arg
        }
    }


    return { CLIParamsValues, commandValue, unresolvedParamsCount }
}


export default parseCommandLineArgs