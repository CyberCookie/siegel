import isExists from '../../../../common/is/exists'

import type { MergedProps } from '../types'


function buildInputRegexp(min: MergedProps['min'], max: MergedProps['max'], precision: MergedProps['precision']): RegExp {
    let regexpTemplate = '^'

    if (min < 0) {
        regexpTemplate += '-'
        max >= 0 && (regexpTemplate += '?')
    }

    regexpTemplate += '(?!00)\\d'

    if (isFinite(min) || isFinite(max)) {
        const maxNumberAllowed = Math.max( Math.abs(min), Math.abs(max) )
        const regexpModificator = isFinite(maxNumberAllowed)
            ?   parseInt(maxNumberAllowed).toString().length
            :   ''

        regexpTemplate += `{0,${regexpModificator}}`
    } else regexpTemplate += '*'

    if (precision != 0) {
        regexpTemplate += '([.,]\\d'
            +   ( isExists(precision) ? `{0,${precision}}` : '*' )
            +   ')?'
    }

    regexpTemplate += '$'


    return new RegExp(regexpTemplate)
}


export default buildInputRegexp