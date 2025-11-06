import '../../global.d.ts'
import createJsonKeysReplacer from '.'


describe('common/json_keys_replace', () => {
    const testObj = {
        name: 'qwerty',
        birthdate: '1970.01.01',
        age: 40,
        id: 'aaaa',
        data: {
            name: 'test'
        }
    }

    const testObjJson = JSON.stringify(testObj)


    test('pack / unpack json using keys map', () => {
        const jsonTransform = createJsonKeysReplacer({
            name: 'a',
            birthdate: 'b',
            age: 'c',
            id: 'd',
            data: 'e'
        })

        const minifiedJson = jsonTransform(testObjJson, true)

        expect(minifiedJson)
            .toBe(
                '{"a":"qwerty","b":"1970.01.01","c":40,"d":"aaaa","e":{"a":"test"}}'
            )

        expect(
            jsonTransform(minifiedJson, false)
        ).toBe(testObjJson)
    })

    test('pack / unpack json using array of keys', () => {
        const jsonTransform = createJsonKeysReplacer([
            'name',
            'birthdate',
            'age',
            'id',
            'data'
        ])

        const minifiedJson = jsonTransform(testObjJson, true)

        expect(minifiedJson)
            .toBe(
                '{"a":"qwerty","b":"1970.01.01","c":40,"d":"aaaa","e":{"a":"test"}}'
            )

        expect(
            jsonTransform(minifiedJson, false)
        ).toBe(testObjJson)
    })
})