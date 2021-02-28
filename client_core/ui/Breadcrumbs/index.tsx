import React, { useState, useLayoutEffect } from 'react'

import isE from '../../utils/is_exists'
import { extractProps, applyRefApi } from '../ui_utils'
import type { _Breadcrumbs } from './types'

import styles from './styles.sass'


const componentID = '-ui-breadcrumbs'

let forceUpdate: React.Dispatch<React.SetStateAction<Indexable>> | undefined;
const dynamicCrumbs: Indexable<React.ReactNode> = {}
const setDynamicCrumb = (crumpId: string, value: React.ReactNode, isForceUpdate = true) => {
    if (dynamicCrumbs[crumpId] != value) {
        dynamicCrumbs[crumpId] = value;
        isForceUpdate && forceUpdate!({})
    }
}

const setDynamicCrumbsBatch = (crumbIDValueMap: Indexable, isForceUpdate = true) => {
    for (const crumbID in crumbIDValueMap) {
        const value = crumbIDValueMap[crumbID]
        dynamicCrumbs[crumbID] = value
    }

    isForceUpdate && forceUpdate!({})
}

const useLayoutEffectFunc = () => () => {
    forceUpdate = undefined
}

const linkClickPreventDefault = (e: React.MouseEvent) => { e.preventDefault() }

const Breadcrumbs: _Breadcrumbs = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Breadcrumbs.defaults, props)
        :   (props as _Breadcrumbs['defaults'] & typeof props)

    const {
        className, theme, attributes, location, separator, config, onChange, refApi
    } = mergedProps;


    forceUpdate = useState({})[1]

    useLayoutEffect(useLayoutEffectFunc, [])


    let breadcrumbsRootProps: typeof attributes = {
        className,
        children: getBreadcrumbs()
    }
    refApi && (applyRefApi(breadcrumbsRootProps, mergedProps))
    attributes && (breadcrumbsRootProps = Object.assign(breadcrumbsRootProps, attributes))


    function getBreadcrumbs() {
        const breadcrumbData = []
        const locationArray = location == '/' ? [''] : location.split('/')
        let loocupScope = config;
        let path = ''
    
        for (let i = 0, l = locationArray.length; i < l; i++) {
            const loc = locationArray[i]
            const data = loocupScope[loc] || Object.values(loocupScope)[0]
    
            if (isE(data)) {
                const { crumb, dynamicCrumb, nested } = data;
    
                const name = dynamicCrumb
                    ?   dynamicCrumbs[dynamicCrumb]
                    :   typeof crumb == 'function'
                            ?   crumb(path, loc)
                            :   crumb;
    
                path += ((loc ? '/' : '') + loc)
    
                breadcrumbData[breadcrumbData.length] = { path, name }
                isE(nested) && (loocupScope = nested)
            } else {
                break
            }
        }
        

        return breadcrumbData.map(({ path, name }, i) => (
            <a key={path} className={theme.link}
                children={`${i ? separator : ''} ${name}`}
                onClick={linkClickPreventDefault}
                onMouseDown={e => { onChange(path, e) }} />
        ))
    }

    
    return <div {...breadcrumbsRootProps} />
}
Breadcrumbs.defaults = {
    className: styles[componentID + '__inner'],
    separator: '',
    theme: {
        root: componentID,
        link: componentID + '_link'
    }
}
Breadcrumbs.ID = componentID;


export { setDynamicCrumb, setDynamicCrumbsBatch, componentID }
export default Breadcrumbs