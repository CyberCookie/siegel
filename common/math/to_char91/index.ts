const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~!@#$%^&*()_+-={}[]:;<>?,./|'

const alphaLen = alpha.length

const toChar91 = (num: number) => {
    let result = ''
    let mod: number

    do {
        mod = num % alphaLen
        result = alpha[mod] + result
        num = Math.floor(num / alphaLen) - 1

    } while (num > -1)

    return result
}


export default toChar91