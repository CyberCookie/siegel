import React, { useState, useLayoutEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { extractProps } from '../ui_utils'
import { _Breadcrumbs } from './types'
import s from './styles.sass'


let componentID = '-ui-breadcrumbs'

let forceUpdate: React.Dispatch<React.SetStateAction<object>> | undefined;
let dynamicCrumbs: Indexable<React.ReactNode> = {}
const setDynamicCrumb = (crumpId: string, value: React.ReactNode, isForceUpdate = true) => {
    if (dynamicCrumbs[crumpId] != value) {
        dynamicCrumbs[crumpId] = value;
        isForceUpdate && forceUpdate!({})
    }
}

const setDynamicCrumbsBatch = (crumbIDValueMap: Indexable, isForceUpdate = true) => {
    for (let crumbID in crumbIDValueMap) {
        let value = crumbIDValueMap[crumbID]
        dynamicCrumbs[crumbID] = value
    }

    isForceUpdate && forceUpdate!({})
}

const useLayoutEffectFunc = () => () => {
    forceUpdate = undefined
}

const Breadcrumbs: _Breadcrumbs = (props, withDefaults) => {
    let { className, attributes, location, separator, config } = withDefaults
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
        let breadcrumbData = []
        let locationArray = location == '/' ? [''] : location.split('/')
        let loocupScope = config;
        let path = ''
    
        for (let i = 0; i < locationArray.length; i++) {
            let loc = locationArray[i]
            let data = loocupScope[loc] || Object.values(loocupScope)[0]
    
            if (data) {
                let { crumb, dynamicCrumb, nested } = data;
    
                let name = dynamicCrumb
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