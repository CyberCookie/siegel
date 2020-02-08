import React from 'react'

import { setDefaultProps, extractProps } from '../ui_utils'
import { Props, DefaultProps } from './types'


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

const setDefaults = (customDefaults: Partial<Props>) => {
    setDefaultProps(defaults, customDefaults)
}

const Pagination = (props: Props) => {
    let { theme, className, wrapperAttr, listLength, curPage, showPerPage, elementsBySide,
        elementsByMiddle, onChange, controlIcon, separator, payload } = extractProps(defaults, props)
    
    className += ` ${theme.pagination}`;
    
    let _wrapperAttr = Object.assign({}, wrapperAttr, {
        className,
        onMouseDown(e: React.MouseEvent) {
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
    
                curPage != newPage && onChange(newPage, e, payload)
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
        let result = []

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