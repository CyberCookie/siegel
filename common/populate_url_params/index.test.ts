import populateUrlParams from './'


describe('common/populateParams', () => {
    const urlString = '/api/:id/foo/:bar'


    test('populate', () => {
        expect(
            populateUrlParams(urlString, {
                id: '1',
                bar: 'value'
            })
        ).toBe('/api/1/foo/value')
    })
})