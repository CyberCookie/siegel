import { describe, test, expect } from 'bun:test'

import getUniqId from './'


describe('common/getUniqId', () => {
    test('get uniq ID', () => {
        expect( getUniqId() )
            .not.toBe( getUniqId() )
    })
})