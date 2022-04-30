import isExists from '../utils/is/exists'
import getFinalURL from './get_final_url'
import type { RouterStore, RouterProps } from './types'


function patchHistory(routerStore: RouterStore, basename: RouterProps['basename']) {
    const [ pathname, setPath ] = routerStore

    history.push = (url: string, state: any, isReplace?: boolean) => {
        let finalURL = getFinalURL(pathname, url)
        if (history.basename) {
            const { basename } = history
            finalURL = `${basename}${ finalURL == '/' ? '' : finalURL }`
        }

        if (finalURL != pathname) {
            isReplace
                ?   history.replaceState(state, '', finalURL)
                :   history.pushState(state, '', finalURL)

            setPath(finalURL)
        }
    }
    window.onpopstate = () => {
        setPath(location.pathname)
    }


    let isRoot = pathname == '/'
    let pathArrayBasenameShift: number | undefined

    if (isExists(basename)) {
        const historyBasename = history.basename
        const actualBasename = isExists(historyBasename)
            ?   historyBasename
            :   basename

        isRoot = isRoot || pathname == (actualBasename || '/')

        pathArrayBasenameShift = actualBasename
            ?   actualBasename.split('/').length - 1
            :   0

        history.basename = actualBasename

        history.updateBasename = newBasename => {
            const { basename } = history
            if (newBasename != basename) {
                history.basename = newBasename
                history.push!(
                    pathname.replace(basename!, '') || '/'
                )
            }
        }

        if (!pathname.startsWith(actualBasename)) {
            const withBasenamePath = isRoot
                ?   actualBasename
                :   `${actualBasename}${pathname}`

            history.push!(withBasenamePath, null, true)
        }
    }


    return { isRoot, pathArrayBasenameShift }
}


export default patchHistory