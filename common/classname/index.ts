/**
 * Builds element className regarding to passed conditions
 *
 * @param initialClassName Class name to concatenate new classes with
 * @param rules where key is a class name to apply
 * @returns class name string
 */
function className(initialClassName: string | Fallish, rules: Obj) {
    let result = initialClassName || ''
    for (const key in rules) {
        rules[key] && (result += ` ${key}`)
    }

    return result
}


export default className