import React, { useState, useLayoutEffect } from 'react'

import isE from '../../utils/is_exists'
import { extractProps, applyRefApi } from '../ui_utils'
import componentID from './id'
import type { _Breadcrumbs, Props, MergedProps } from './types'

import styles from './styles.sass'


type State = Indexable<string>
type Store = [ State, React.Dispatch<React.SetStateAction<State>> ]


const linkClickPreventDefault = (e: React.MouseEvent) => { e.preventDefault() }

const Breadcrumbs: _Breadcrumbs = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Breadcrumbs.defaults, props, false)
        :   (props as MergedProps)

    const {
        className, theme, attributes, history, separator, config, onChange, refApi, hasDynamicCrumbs
    } = mergedProps;


    let dynamicCrumbsStore: Store;
    if (hasDynamicCrumbs) {
        dynamicCrumbsStore = useState({})
        const [ state, setState ] = dynamicCrumbsStore;

        useLayoutEffect(() => {
            const setDynamicCrumbsHandler = (function({ detail }: CustomEvent) {
                setState(
                    Object.assign({}, state, detail)
                )
            } as EventListener)


            window.addEventListener(componentID, setDynamicCrumbsHandler)
            return () => {
                window.removeEventListener(componentID, setDynamicCrumbsHandler)
            }
        })
    }



    let breadcrumbsRootProps: Props['attributes'] = {
        className,
        children: getBreadcrumbs()
    }
    refApi && (applyRefApi(breadcrumbsRootProps, mergedProps))
    attributes && (breadcrumbsRootProps = Object.assign(breadcrumbsRootProps, attributes))

    
    function getBreadcrumbs() {
        const location = history.location.pathname;
        const locationArray = location == '/' ? [''] : location.split('/')

        const breadcrumbsElements = []
        let loocupScope = config;
        let path = ''
        for (let i = 0, l = locationArray.length; i < l; i++) {
            const loc = locationArray[i]
            const data = loocupScope[loc] || Object.values(loocupScope)[0]

            if (isE(data)) {
                const { crumb, dynamicCrumb, children } = data;
                
                const newPath = path + ((loc ? '/' : '') + loc)
                isE(children) && (loocupScope = children)


                const name = hasDynamicCrumbs && dynamicCrumb
                    ?   dynamicCrumbsStore[0][dynamicCrumb] || dynamicCrumb
                    :   typeof crumb == 'function'
                            ?   crumb(newPath, loc)
                            :   crumb;

                breadcrumbsElements.push(
                    <a key={newPath} className={theme.link} onClick={linkClickPreventDefault}
                        onMouseDown={e => {
                            onChange
                                ?   onChange(newPath, e)
                                :   history.push(newPath)
                        }}>
                        
                        { i ? <>{separator} {name}</> : name as React.ReactNode }
                    </a>
                )

                path = newPath
            } else break
        }
        

        return breadcrumbsElements
    }

    
    return <div {...breadcrumbsRootProps } />
}
Breadcrumbs.defaults = {
    className: styles[componentID + '_inner'],
    separator: '',
    theme: {
        root: componentID,
        link: componentID + '_link'
    }
}
Breadcrumbs.ID = componentID;


export { componentID }
export default Breadcrumbs
export * from './types'