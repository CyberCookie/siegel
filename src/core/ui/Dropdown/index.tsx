import React,
    { ReactNode } from 'react'

type ListElement = {
    title: ReactNode,
    children: ListElement[]
}

interface Props {
    theme?: UITheme,
    className?: string,
    soloOpen?: boolean,
    dropdownIcon: ReactNode,
    list: ListElement[],
    builder?: (title: ReactNode) => ({ className: string, elem: ReactNode })
}

interface DefaultProps {
    theme: UITheme
}


const componentID = '-ui-dropdown'

const defaults: DefaultProps = {
    theme: {
        dropdown: componentID,
        item_with_child: componentID + '_item_with_child',
        item_title: componentID + '_item_title',
        item_without_child: componentID + '_item_without_child'
    }
}

const setDefaults = (customDefaults: Props) => Object.assign(defaults, customDefaults)


const onClickHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
}

const Dropdown = (props: Props) => {
    let theme = props.theme
        ?   Object.assign({}, defaults.theme, props.theme)
        :   defaults.theme;

    let { list, builder, dropdownIcon, soloOpen, className } = Object.assign({}, defaults, props)


    let wrapperClassName = theme.dropdown;
    className && (wrapperClassName += ` ${className}`)


    function onDropdownToggle(e: React.MouseEvent<HTMLDetailsElement>) {
        e.stopPropagation()
        let dropdownTitle = e.currentTarget;
        let curState = dropdownTitle.open;

        if (soloOpen) {
            let sibling = dropdownTitle.parentElement!.firstChild;

            while (sibling) {
                (sibling as HTMLDetailsElement).open = false;
                sibling = sibling.nextSibling
            }
        }
        
        dropdownTitle.open = !curState
    }


    function childrenMapper({ title, children }: ListElement, i: number) {
        let wrapperClass;

        if (builder) {
            let { elem, className } = builder(title)
            title = elem
            wrapperClass = className
        }

        return children
            ?   <details key={i} className={theme.item_with_child}
                    onClick={onClickHandler}
                    onMouseDown={onDropdownToggle}>

                    <summary className={`${theme.item_title} ${wrapperClass || ''}`}>
                        { title }
                        { dropdownIcon }
                    </summary>

                    { children.map(childrenMapper) }
                </details>

            :   <div key={i} className={theme.item_without_child}
                    children={title} />
    }


    return (
        <div children={list.map(childrenMapper)} className={wrapperClassName} />
    )
}


export { setDefaults }
export default Dropdown