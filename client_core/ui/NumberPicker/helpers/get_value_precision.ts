function getValuePrecision(_num: number) {
    const stringNum = _num+''
    const indexOfDot = stringNum.indexOf('.')

    return indexOfDot >= 0 ? stringNum.length - indexOfDot - 1 : 0
}


export default getValuePrecision