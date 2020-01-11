import React from 'react'

import { setDefaultProps, extractProps, PropsComponentBase } from '../ui_utils'

type Props = {
    path: string,
    title: React.ReactNode
} & PropsComponentBase

type DefaultProps = {
    className: NonNullable<PropsComponentBase['className']>
}


const componentID = '-ui-external_link'

const defaults: DefaultProps = {
    className: componentID
}

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}


const onMouseDown = (e: React.MouseEvent<HTMLAnchorElement>) => {
    let { target, href } = e.currentTarget;
    window.open(href, target)
}

const onClick = (e: React.MouseEvent) => e.preventDefault()

const ExternalLink = (props: Props) => {
    let { className, path, title } = extractProps(defaults, props)
    
    let attributes: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
        onClick, onMouseDown, className,
        target: '_blank',
        rel: 'noreferrer',
        href: path.startsWith('http') ? path : ('https://' + path)
    }
    title && (attributes.children = title)


    return <a {...attributes} />
}


export { setDefaults }
export default ExternalLink