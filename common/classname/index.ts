/**
 * Builds element className regarding to passed conditions
 *
 * @param initialClassName - Class name to concatenate new classes with
 * @param rules - Where key is a class name to apply
 * @returns class name string
 */
function className(
    initialClassName: string | Exclude<Fallish, string>,
    rules: Record<string, unknown>
) {

    let result = initialClassName || ''
    for (let i = 0, keys = Object.keys(rules), l = keys.length; i < l; i++) {
        const className = keys[i]
        rules[className] && (result += ` ${className}`)
    }


    return result
}


export default className