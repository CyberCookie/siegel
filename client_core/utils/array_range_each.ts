export default <T>(arr: T[], cb: (elem: T, index: number) => boolean | void, from: number, to: number) => {
    for (let i = from; i < to; i++)
        if (cb(arr[i], i)) break
}