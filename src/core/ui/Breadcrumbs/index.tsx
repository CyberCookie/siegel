import React, { useState, useLayoutEffect,
    ReactNode, Attributes, SetStateAction } from 'react'
import { NavLink } from 'react-router-dom'

import s from './styles.sass'


type BreadcrumbsPiece = {
    path: string,
    name: string
}

type BreadcrumbsConfigByPath = {
    dynamicCrumb: string,
    crumb: string | ((path: string, name: string) => void),
    nested: {
        [path: string]: BreadcrumbsConfigByPath
    }
}

type BreadcrumbsConfig = {
    [path: string]: BreadcrumbsConfigByPath
}

interface Props {
    className?: string,
    attributes?: Attributes,
    location: string,
    config: BreadcrumbsConfig
}

interface defaultProps {
    className: string,
    separator: ReactNode
}


let forceUpdate: React.Dispatch<SetStateAction<object>> | undefined;
const dynamicCrumbs: Indexable = {}
const setDynamicCrumb = (crumpId: string, value: ReactNode, isForceUpdate = true) => {
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

let defaults: defaultProps = {
    className: s[componentID],
    separator: ''
}


const useLayoutEffectFunc = () => () => {
    forceUpdate = undefined
}

const Breadcrumbs = (props: Props) => {
    let className = defaults.className;
    props.className && (className += ` ${props.className}`)

    let { attributes, location, separator, config } = Object.assign({}, defaults, props);

    let [ _, _forceUpdate ] = useState()
    forceUpdate = _forceUpdate;

    useLayoutEffect(useLayoutEffectFunc, [])

    
    const breadcrumbDataMapper = (data: BreadcrumbsPiece, i: number) => (
        <NavLink key={data.path} to={data.path}
            children={`${i ? separator : ''} ${data.name}`} />
    )

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
        
        return breadcrumbData.map(breadcrumbDataMapper)
    }

    
    return <div {...breadcrumbProps} />
}


export { setDynamicCrumb, setDynamicCrumbsBatch }
export default Breadcrumbs