type RangeEach = <T>(
    arr: T[],
    cb: (elem: T, index: number) => boolean | void,
    from: number,
    to: number
) => void


const rangeEach: RangeEach = (arr, cb, from, to) => {
    for (let i = from; i < to; i++)
        if (cb(arr[i], i)) break
}


export default rangeEach