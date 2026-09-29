function getValuePrecision(value: number) {
    const stringValue = String(value)
    const indexOfDot = stringValue.indexOf('.')

    return indexOfDot >= 0
        ?   stringValue.length - indexOfDot - 1
        :   0
}


export default getValuePrecision