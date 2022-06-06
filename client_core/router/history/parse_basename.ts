import isExists from '../../utils/is/exists'
import type { RouterProps } from '../types'


const parseBasename = (basename: RouterProps['basename'], pathname: Location['pathname']) => {
    const historyBasename = history.basename
    const actualBasename = isExists(historyBasename)
        ?   historyBasename
        :   basename


    return {
        finalBasename: actualBasename as string,
        isRoot: pathname == '/' || pathname == actualBasename,
        pathArrayBasenameShift: actualBasename
            ?   actualBasename.split('/').length - 1
            :   0
    }
}


export default parseBasename