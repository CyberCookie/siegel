import React, { useState, useLayoutEffect } from 'react'

import isE from '../../utils/is_exists'
import { extractProps, applyRefApi } from '../ui_utils'
import componentID from './id'
import {
    Component, MergedProps, Store,
    Props, BreadcrumbConfig
} from './types'

import styles from './styles.sass'


const linkClickPreventDefault = (e: React.MouseEvent) => { e.preventDefault() }

function getBreadcrumbs(props: MergedProps, dynamicCrumbsStore: Store | undefined) {
    const { theme, history, separator, config, onChange, hasDynamicCrumbs } = props

    const location = history.location.pathname
    const locationArray = location == '/' ? [''] : location.split('/')
    if (locationArray[ locationArray.length - 1 ] == '') {
        locationArray[ locationArray.length - 1 ] = '/'
    }

    const breadcrumbsElements = []
    let loocupScope = config
    let path = ''
    for (let i = 0, l = locationArray.length; i < l; i++) {
        const loc = locationArray[i]
        const data = loocupScope[loc] || Object.values(loocupScope)[0]

        if (isE(data)) {
            const { crumb, dynamicCrumb, children } = data

            const newPath = path + ((loc ? '/' : '') + loc)
            isE(children) && (loocupScope = children)


            if (crumb || dynamicCrumb) {
                const name = dynamicCrumb && hasDynamicCrumbs
                    ?   dynamicCrumbsStore![0][dynamicCrumb] || dynamicCrumb
                    :   typeof crumb == 'function'
                            ?   crumb(newPath, loc)
                            :   crumb

                breadcrumbsElements.push(
                    <a key={ newPath } className={ theme.link } onClick={ linkClickPreventDefault }
                        onMouseDown={ e => {
                            onChange
                                ?   onChange(newPath, e)
                                :   history.push(newPath)
                        } }>

                        { i ? <>{separator} {name}</> : name as React.ReactNode }
                    </a>
                )
            }

            path = newPath
        } else break
    }


    return breadcrumbsElements
}

const Breadcrumbs: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Breadcrumbs.defaults, props, false)
        :   (props as MergedProps)

    const { className, attributes, refApi, hasDynamicCrumbs } = mergedProps


    let dynamicCrumbsStore: Store | undefined
    if (hasDynamicCrumbs) {
        dynamicCrumbsStore = useState({})
        const [ state, setState ] = dynamicCrumbsStore

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
        }, [])
    }


    const breadcrumbsRootProps: Props['attributes'] = {
        className,
        children: getBreadcrumbs(mergedProps, dynamicCrumbsStore!)
    }
    refApi && (applyRefApi(breadcrumbsRootProps, mergedProps))
    attributes && Object.assign(breadcrumbsRootProps, attributes)


    return <div { ...breadcrumbsRootProps } />
}
Breadcrumbs.defaults = {
    className: styles[componentID + '_inner'],
    separator: '',
    theme: {
        root: '',
        link: ''
    }
}
Breadcrumbs.ID = componentID


export { componentID }
export default Breadcrumbs
export type { BreadcrumbConfig, Props }