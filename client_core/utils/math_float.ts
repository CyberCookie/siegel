function floatMath(precision: number, ...args: number[]) {
    const base = Math.pow(10, precision)
    const sum = args.reduce((acc, el) => acc + el * base, 0)

    return Math.round( sum ) / base
}


export default floatMath