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
        const keysSet = new Set(keys)

        for (
            let i = 0,
                duplicatedKeysCount = 0,
                keysCollisionsCount = 0;
            i < keys.length;
            i++
        ) {

            const key = keys[i]
            if (encodeKeysMap[key]) {
                duplicatedKeysCount++
                continue

            } else {
                const encodeKey = toChar91(i - duplicatedKeysCount + keysCollisionsCount)

                if (keysSet.has(encodeKey as (typeof keys)[number])) {
                    i--
                    keysCollisionsCount++
                    continue

                } else {
                    decodeKeysMap[encodeKey] = key
                    encodeKeysMap[key] = encodeKey
                }
            }
        }

    } else {
        Object.entries(keys)
            .forEach(([ keyToEncode, keyToDecode ]) => {
                decodeKeysMap[keyToDecode!] = keyToEncode
                encodeKeysMap[keyToEncode] = keyToDecode
            })
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