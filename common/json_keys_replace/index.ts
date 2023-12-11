import toChar91 from '../math/to_char91'


type CreateJsonCoder = <_Keys extends string = string>(
    keys: Obj<_Keys> | _Keys[]
) => (
    json: string,
    toMinified?: boolean
) => string


const keysMatchRegExp = /[{|,]\s*?"(.*?)":/g

const createJsonKeysCoder: CreateJsonCoder = keys => {
    const decodeKeysMap: Obj<string> = {}
    const encodeKeysMap: Obj<string> = {}

    if (Array.isArray(keys)) {
        for (let i = 0, duplicatedKeysCount = 0; i < keys.length; i++) {
            const key = keys[i]
            if (encodeKeysMap[key]) {
                duplicatedKeysCount++
                continue

            } else {
                const encodeKey = toChar91(i - duplicatedKeysCount)

                decodeKeysMap[encodeKey] = key
                encodeKeysMap[key] = encodeKey
            }
        }

    } else {
        for (const keyToEncode in keys) {
            const keyToDecode = keys[keyToEncode]!

            decodeKeysMap[keyToDecode] = keyToEncode
            encodeKeysMap[keyToEncode] = keyToDecode
        }
    }


    return (json, toMinified = true) => (
        json.replaceAll(keysMatchRegExp, (match, key) => {
            const replaceWithKey = toMinified
                ?   encodeKeysMap[key]
                :   decodeKeysMap[key]

            return replaceWithKey
                ?   match.replace(key, replaceWithKey)
                :   match
        })
    )
}


export default createJsonKeysCoder