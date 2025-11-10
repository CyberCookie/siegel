/**
 * This function is to perform _add_ and _subtract_ math operations
 * with float numbers to always get correct result
 *
 * @param precision - Maximmal digits count after dot among all the next provided numbers
 * @param args - All the numbers to perform operations with
 * @returns correct arifmetic result
 */
function floatArifmetic(precision: number, ...args: number[]) {
    const base = Math.pow(10, precision)
    const sum = args.reduce((acc, el) => acc + Math.round(el * base), 0)

    return Math.round(sum) / base
}


export default floatArifmetic