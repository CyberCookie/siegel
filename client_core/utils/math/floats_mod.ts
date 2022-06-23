const floatMod = (a: number, b: number, precision: number) => {
    const multiply = Math.pow(10, precision)

    const a_multiplied = Math.round(a * multiply)
    const b_multiplied = Math.round(b * multiply)

    return (a_multiplied % b_multiplied) / multiply
}


export default floatMod