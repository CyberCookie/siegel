type RangeEach = <T>(
    arr: T[],
    from: number,
    to: number,
    cb: (elem: T, index: number) => boolean | void
) => void


/**
 * Iterates through array in range. Execs callback on each iteration step.
 * Breaks a loop if callback returns **true**
 *
 * @param arr - Array to iterate over
 * @param from - Index to start iteration from
 * @param to - Index to iterate to
 * @param cb - To execute on each step
 */
const rangeEach: RangeEach = (arr, from, to, cb) => {
    for (let i = from; i < to; i++)
        if (cb(arr[i], i)) break
}


export default rangeEach