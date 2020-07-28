export default <T>(arr: T[], from: number, to: number, cb: (elem: T, index: number) => boolean | void) => {
    for (let i = from; i < to; i++)
        if (cb(arr[i], i)) break
}