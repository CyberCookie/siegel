/**
 * Transform condition `rules` into CSS classes.
 * @param initialClassName - minimal class name of element. Can be empty string
 * @returns raw object when key is class name and value is condition whether to apply this class name
 */
export default function cx(initialClassName: string, rules: Indexable<string | number | boolean>): string {
    let result = initialClassName || ''
    for (const key in rules) {
        rules[key] && (result += ` ${key}`)
    }

    return result
}