export default <T>(arr: T[], cb: (elem: T, index: number) => boolean | void, from = 0, to = arr.length) => {
    for (let i = from; i < to; i++)
        if (cb(arr[i], i)) break
}