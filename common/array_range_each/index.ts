type RangeEach = <T>(
    arr: T[],
    from: number,
    to: number,
    cb: (elem: T, index: number) => boolean | void
) => void


const rangeEach: RangeEach = (arr, from, to, cb) => {
    for (let i = from; i < to; i++)
        if (cb(arr[i], i)) break
}


export default rangeEach