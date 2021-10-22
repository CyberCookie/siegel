export default function(precision: number, ...args: number[]) {
    const base = Math.pow(10, precision)
    const sum = args.reduce((acc, el) => acc + Math.round(el * base), 0)

    return Math.round(sum) / base
}