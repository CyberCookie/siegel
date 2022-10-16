function className(initialClassName: string, rules: Indexable<string | number | boolean>) {
    let result = initialClassName || ''
    for (const key in rules) {
        rules[key] && (result += ` ${key}`)
    }

    return result
}


export default className