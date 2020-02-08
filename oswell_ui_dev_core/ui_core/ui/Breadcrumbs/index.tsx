import React, { useState, useLayoutEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { setDefaultProps, extractProps } from '../ui_utils'
import { Props, DefaultProps } from './types'
import s from './styles.sass'


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

let componentID = '-ui-breadcrumbs'

let defaults: DefaultProps = {
    className: s[componentID],
    separator: ''
}


const useLayoutEffectFunc = () => () => {
    forceUpdate = undefined
}

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}

const Breadcrumbs = (props: Props) => {
    let { className, attributes, location, separator, config } = extractProps(defaults, props);

    let [ _, _forceUpdate ] = useState()
    forceUpdate = _forceUpdate;

    useLayoutEffect(useLayoutEffectFunc, [])


    let breadcrumbProps = {
        ...attributes,
        className,
        children: getBreadcrumbs()
    }


    function getBreadcrumbs() {
        let breadcrumbData = []
        let locationArray = location == '/' ? [''] : location.split('/')
        let loocupScope = config;
        let path = '';
    
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

    
    return <div {...breadcrumbProps} />
}


export { setDefaults, setDynamicCrumb, setDynamicCrumbsBatch }
export default Breadcrumbs