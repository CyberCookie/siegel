/**
 * Transform condition `rules` into CSS classes. 
 * @param  {string} staticClassName - minimal class name of element. Can be empty string
 * @return {Object} raw object when key is class name and value is condition whether to apply this class name 
 */
function cx(staticClassName: string, rules: Record<string, string>): string {
    let result = staticClassName;
    for (let key in rules) {
        rules[key] && (result += ` ${key}`)
    }

    return result
}


export default cx