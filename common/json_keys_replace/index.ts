import toChar91 from '../math/to_char91'
import FastSet from '../FastSet'


type CreateJsonCoder = <_Keys extends string = string>(
    keys: Obj<_Keys> | _Keys[]
) => (
    json: string,
    toMinified?: boolean
) => string


const keysMatchRegExp = /[{|,]\s*?"(.*?)":/g

const createJsonKeysCoder: CreateJsonCoder = jsonKeysObj => {
    const decodeKeysMap: Obj<string> = {}
    const encodeKeysMap: Obj<string> = {}

    if (Array.isArray(jsonKeysObj)) {
        const keysSet = new FastSet(jsonKeysObj)

        for (
            let i = 0,
                duplicatedKeysCount = 0,
                keysCollisionsCount = 0;
            i < jsonKeysObj.length;
            i++
        ) {

            const key = jsonKeysObj[i]
            if (encodeKeysMap[key]) {
                duplicatedKeysCount++
                continue

            } else {
                const encodeKey = toChar91(i - duplicatedKeysCount + keysCollisionsCount)

                if (keysSet.has(encodeKey)) {
                    i--
                    keysCollisionsCount++
                    continue

                } else {
                    decodeKeysMap[encodeKey] = key
                    encodeKeysMap[key] = encodeKey
                }
            }
        }

    } else for (let i = 0, keys = Object.keys(jsonKeysObj), l = keys.length; i < l; i++) {
        const keyToEncode = keys[i]
        const keyToDecode = jsonKeysObj[keyToEncode]

        decodeKeysMap[keyToDecode!] = keyToEncode
        encodeKeysMap[keyToEncode] = keyToDecode
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