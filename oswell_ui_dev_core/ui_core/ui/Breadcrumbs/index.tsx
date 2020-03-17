import React, { useState, useLayoutEffect } from 'react'
import { NavLink } from 'react-router-dom'

import isE from '../../utils/is_exists'
import { extractProps } from '../ui_utils'
import { _Breadcrumbs } from './types'
import s from './styles.sass'


const componentID = '-ui-breadcrumbs'

let forceUpdate: React.Dispatch<React.SetStateAction<object>> | undefined;
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

const Breadcrumbs: _Breadcrumbs = (props, withDefaults) => {
    const { className, attributes, location, separator, config } = withDefaults
        ?   (props as _Breadcrumbs['defaults'] & typeof props)
        :   extractProps(Breadcrumbs.defaults, props)

    forceUpdate = useState({})[1]

    useLayoutEffect(useLayoutEffectFunc, [])


    let breadcrumbsRootProps: typeof attributes = {
        className,
        children: getBreadcrumbs()
    }
    attributes && (breadcrumbsRootProps = Object.assign(breadcrumbsRootProps, attributes))


    function getBreadcrumbs() {
        const breadcrumbData = []
        const locationArray = location == '/' ? [''] : location.split('/')
        let loocupScope = config;
        let path = ''
    
        for (let i = 0, l = locationArray.length; i < l; i++) {
            const loc = locationArray[i]
            const data = loocupScope[loc] || Object.values(loocupScope)[0]
    
            if (data) {
                const { crumb, dynamicCrumb, nested } = data;
    
                const name = dynamicCrumb
                    ?   (dynamicCrumbs[dynamicCrumb] || '--')
                    :   typeof crumb == 'function'
                            ?   crumb(path, loc)
                            :   crumb;
    
                path += ((loc ? '/' : '') + loc)
    
                breadcrumbData[breadcrumbData.length] = { path, name }
                nested && (loocupScope = nested)
            } else {
                break
            }
        }
        

        return breadcrumbData.map((data, i) => (
            <NavLink key={data.path} to={data.path}
                children={`${i ? separator : ''} ${data.name}`} />
        ))
    }

    
    return <div {...breadcrumbsRootProps} />
}
Breadcrumbs.defaults = {
    className: s[componentID],
    separator: ''
}
Breadcrumbs.ID = componentID;


export { setDynamicCrumb, setDynamicCrumbsBatch, componentID }
export default Breadcrumbs