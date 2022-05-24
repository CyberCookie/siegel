import isExists from '../../utils/is/exists'
import type { RouterProps } from '../types'


const parseBasename = (basename: RouterProps['basename']) => {
    const historyBasename = history.basename
    const actualBasename = isExists(historyBasename)
        ?   historyBasename
        :   basename

    return {
        finalBasename: actualBasename as string,
        isRoot: location.pathname == '/' || actualBasename == location.pathname,
        pathArrayBasenameShift: actualBasename
            ?   actualBasename.split('/').length - 1
            :   0
    }
}


export default parseBasename