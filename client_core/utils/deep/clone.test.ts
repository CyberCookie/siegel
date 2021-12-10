import deepClone from './clone'


describe('utils/deep/clone', () => {
    test('clone arr', () => {
        const origValue = [ 1, 2, 3 ]
        const newValue = deepClone(origValue)

        expect(newValue).toEqual(origValue)
    })

    test('clone obj', () => {
        const origValue = {
            a: 1,
            b: 2,
            c: 3
        }
        const newValue = deepClone(origValue)

        expect(newValue).toEqual(origValue)
    })

    test('clone big obj', () => {
        const origValue = {
            a: 1,
            b: {
                a: 'asd',
                b: null,
                c: [ null, undefined, {
                    a: 20,
                    c: [{}],
                    d: new Date()
                } ]
            },
            c: 3
        }
        const newValue = deepClone(origValue)


        expect(newValue).toEqual(origValue)
    })

    test('clone undef', () => {
        expect( deepClone(undefined) ).toBeUndefined()
    })
})