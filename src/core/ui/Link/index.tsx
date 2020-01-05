import React,
    { MouseEvent, AnchorHTMLAttributes } from 'react'

interface Props {
    className?: string,
    path: string,
    title: string | JSX.Element
}

interface DefaultProps {
    className: string
}


const componentID = '-ui-external_link'

const defaults: DefaultProps = {
    className: componentID
}

const setDefaults = (customDefaults: Props) => Object.assign(defaults, customDefaults)


const onMouseDown = (e: MouseEvent<HTMLAnchorElement>) => {
    let { target, href } = (e.currentTarget as HTMLAnchorElement);
    window.open(href, target)
}

const onClick = (e: MouseEvent) => e.preventDefault()

const ExternalLink = (props: Props) => {
    let className = defaults.className;
    props.className && (className += ` ${props.className}`)

    let { path, title } = Object.assign({}, defaults, props)

    
    let attributes: AnchorHTMLAttributes<HTMLAnchorElement> = {
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