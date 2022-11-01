import React, { useMemo, useState, useLayoutEffect } from 'react'

import isExists from '../../../common/is/exists'
import component from '../_internals/component'
import mergeTagAttributes from '../_internals/merge_tag_attributes'
import applyRefApi from '../_internals/ref_apply'
import componentID from './id'

import type {
    Component, MergedProps, DynamicCrumbsStore, Props,
    BreadcrumbConfig, BreadcrumbConfigPart, CrumbComposedConfig,
    DynamicCrumbsCustomEventPayload
} from './types'

import styles from './styles.sass'


function linkClickPreventDefault(e: React.MouseEvent) {
    e.preventDefault()
}

function getBreadcrumbs(
    props: MergedProps,
    dynamicCrumbsState: DynamicCrumbsStore[0] | undefined,
    hasDynamicCrumbs: boolean | undefined
) {

    const { theme, separator, config, onChange } = props

    const { pathname } = location
    const locationArray = pathname == '/' ? [''] : pathname.split('/')
    if (locationArray.at(-1) == '') {
        locationArray[ locationArray.length - 1 ] = '/'
    }


    const breadcrumbsElements = []
    let loocupScope = config
    let path = ''
    for (let i = 0, l = locationArray.length; i < l; i++) {
        const loc = locationArray[i]
        const data = loocupScope[loc] || loocupScope['*']

        if (isExists(data)) {
            const { crumb, dynamicCrumb, children } = data as BreadcrumbConfigPart

            const newPath = `${path}${loc ? '/' : ''}${loc}`

            isExists(children) && (loocupScope = children)


            if (crumb || dynamicCrumb) {
                const name = dynamicCrumb && hasDynamicCrumbs
                    ?   dynamicCrumbsState![dynamicCrumb] || dynamicCrumb
                    :   typeof crumb == 'function'
                            ?   crumb(newPath, loc)
                            :   crumb

                breadcrumbsElements.push(
                    <a key={ newPath } className={ theme.crumb } href={ newPath || '/' }
                        onClick={ linkClickPreventDefault }
                        onMouseDown={ e => {
                            onChange(newPath, loc, e)
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

const checkHasDynamicCrumb: (config: Props['config']) => boolean | undefined = config => {
    for (const path in config) {
        const { children, dynamicCrumb } = config[path] as BreadcrumbConfigPart
        if (dynamicCrumb) return true
        else if (children) return checkHasDynamicCrumb(children)
    }
}

const Breadcrumbs: Component = component(
    componentID,
    {
        className: styles.root!,
        separator: '',
        theme: {
            root: '',
            crumb: ''
        }
    },
    props => {

        const {
            dynamicCrumbsID = componentID,
            className, rootTagAttributes, refApi, config
        } = props

        const hasDynamicCrumbs = useMemo(() => checkHasDynamicCrumb(config), [])

        let dynamicCrumbsState: DynamicCrumbsStore[0] | undefined
        if (hasDynamicCrumbs) {
            const [ state, setState ] = useState({})
            dynamicCrumbsState = state

            useLayoutEffect(() => {
                const setDynamicCrumbsHandler = (function({ detail }: CustomEvent<DynamicCrumbsCustomEventPayload>) {
                    const { crumbs, componentDynamicCrumbsID = componentID } = detail

                    dynamicCrumbsID == componentDynamicCrumbsID
                        &&  setState({ ...state, ...crumbs })
                } as EventListener)


                addEventListener(componentID, setDynamicCrumbsHandler)
                return () => {
                    removeEventListener(componentID, setDynamicCrumbsHandler)
                }
            }, [])
        }


        let breadcrumbsRootProps: Props['rootTagAttributes'] = {
            className,
            children: getBreadcrumbs(props, dynamicCrumbsState!, hasDynamicCrumbs)
        }
        refApi && (applyRefApi(breadcrumbsRootProps, props))
        rootTagAttributes && (breadcrumbsRootProps = mergeTagAttributes(breadcrumbsRootProps, rootTagAttributes))


        return <div { ...breadcrumbsRootProps } />
    }
)


export default Breadcrumbs
export { componentID }
export {
    Component, Props, BreadcrumbConfig, CrumbComposedConfig,
    DynamicCrumbsCustomEventPayload
}