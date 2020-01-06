import React, { ReactNode, ReactChild } from 'react'

interface Props {
    theme?: UITheme,
    className?: string,
    wrapperAttr?: React.Attributes,
    listLength: number,
    curPage: number,
    showPerPage: number,
    elementsBySide?: number,
    elementsByMiddle?: number,
    onPageClick: (nextPage: number) => void,
    controlIcon?: ReactNode,
    separator?: ReactNode
}

interface DefaultProps {
    theme: UITheme,
    elementsBySide: number,
    elementsByMiddle: number,
    separator: string
}


const componentID = '-ui-pagination'

const defaults: DefaultProps = {
    theme: {
        pagination: componentID,
        separator: componentID + '_separator',
        control: componentID + '_control',
        control__active: componentID + '_control__active',
        control__disabled: componentID + '_control__disabled'
    },

    elementsBySide: 1,
    elementsByMiddle : 1,
    separator: '...'
}

const setDefaults = (customDefaults: Props) => Object.assign(defaults, customDefaults)

const Pagination = (props: Props) => {
    let theme = props.theme
        ?   Object.assign({}, defaults.theme, props.theme)
        :   defaults.theme;

    let { className, wrapperAttr, listLength, curPage, showPerPage, elementsBySide, elementsByMiddle,
        onPageClick, controlIcon, separator } = Object.assign({}, defaults, props)
    
        
    let wrapperClassName = theme.pagination;
    className && (wrapperClassName += ` ${className}`)
    
    let _wrapperAttr = Object.assign({}, wrapperAttr, {
        className: wrapperClassName,
        onMouseDown(e: React.MouseEvent<HTMLElement>) {
            let page = (e.target as HTMLDivElement).dataset.page;
    
            if (page) {
                let newPage = curPage;
                if (page == 'prev' && curPage != 1) {
                    newPage--
                } else if (page == 'next' && curPage != numberOfPages) {
                    newPage++
                } else if (0 < +page && +page <= numberOfPages) {
                    newPage = +page
                }
    
                curPage != newPage && onPageClick(newPage)
            }
        }
    })

    let numberOfPages = Math.ceil(listLength / showPerPage)

    
    const getPageElement = (page: number) => (
        <div className={`${theme.control} ${page == curPage ? theme.control__active : '' }`}
            key={page} data-page={page} children={page} />
    )

    const getSeparator = (key: string) => (
        <div children={separator} key={key} className={theme.separator} />
    )

    function getPaginationElements() {
        let result: ReactNode[] = []

        let from = curPage - elementsByMiddle;
        let minFrom = elementsBySide + 1;
        
        let to = curPage + elementsByMiddle;
        let maxTo = numberOfPages - elementsBySide;


        for (let i = 1; i <= elementsBySide; i++) {
            result.push(getPageElement(i))
        }
        from > minFrom && result.push(getSeparator('p'))

        from <= elementsBySide && (from = minFrom)
        to > maxTo && (to = maxTo)
        for (let i = from; i <= to; i++) {
            result.push(getPageElement(i))
        }
        
        to < maxTo && result.push(getSeparator('n'))
        for (let i = maxTo + 1; i <= numberOfPages; i++) {
            result.push(getPageElement(i))
        }
        
        return result
    }


    return numberOfPages > 1 && (
        <div {..._wrapperAttr}>
            <div children={controlIcon} data-page='prev'
                className={`${theme.control} ${curPage == 1 ? theme.control__disabled : ''}`} />

            { getPaginationElements() }

            <div children={controlIcon} data-page='next'
                className={`${theme.control} ${curPage == numberOfPages ? theme.control__disabled : ''}`} />
        </div>
    )
}


export { setDefaults }
export default Pagination