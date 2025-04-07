/**
 * Builds element className regarding to passed conditions
 *
 * @param initialClassName Class name to concatenate new classes with
 * @param rules where key is a class name to apply
 * @returns class name string
 */
function className(
    initialClassName: string | Exclude<Fallish, string>,
    rules: Record<string, unknown>
) {

    let result = initialClassName || ''
    Object.entries(rules)
        .forEach(([ className, condition ]) => {
            condition && (result += ` ${className}`)
        })

    return result
}


export default className