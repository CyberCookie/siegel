/**
 * Performs mod calculations with given float numbers
 *
 * @param a Left hand operand
 * @param b Right hand operand
 * @param precision Maximmal digits count after dot among all the next provided numbers
 * @returns mod result
 */
const floatMod = (a: number, b: number, precision: number) => {
    const multiply = Math.pow(10, precision)

    const a_multiplied = Math.round(a * multiply)
    const b_multiplied = Math.round(b * multiply)

    return (a_multiplied % b_multiplied) / multiply
}


export default floatMod