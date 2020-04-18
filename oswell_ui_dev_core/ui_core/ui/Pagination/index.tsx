import React from 'react'

import { extractProps } from '../ui_utils'
import { _Pagination } from './types'


const componentID = '-ui-pagination'

const Pagination: _Pagination = (props, withDefaults) => {
    const mergedProps = withDefaults
        ?   (props as _Pagination['defaults'] & typeof props)
        :   extractProps(Pagination.defaults, props)
    
    const { className, theme, attributes, listLength, curPage, showPerPage, elementsBySide,
        elementsByMiddle, onChange, controlIcon, separator, payload } = mergedProps;

    
    let paginationRootProps = {
        className,
        onMouseDown(e: React.MouseEvent) {
            const page = (e.target as HTMLDivElement).dataset.page;
    
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
    }
    attributes && (paginationRootProps = Object.assign(paginationRootProps, attributes))

    const numberOfPages = Math.ceil(listLength / showPerPage)

    
    const getPageElement = (page: number) => (
        <div className={`${theme.control} ${page == curPage ? theme.control__active : '' }`}
            key={page} data-page={page} children={page} />
    )

    const getSeparator = (key: string) => (
        <div children={separator} key={key} className={theme.separator} />
    )

    function getPaginationElements() {
        const result = []

        let from = curPage - elementsByMiddle;
        const minFrom = elementsBySide + 1;
        
        let to = curPage + elementsByMiddle;
        const maxTo = numberOfPages - elementsBySide;


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


    return (
        <div {...paginationRootProps}>
            { numberOfPages > 1
                ?   <>
                        <div children={controlIcon} data-page='prev'
                            className={`${theme.control} ${curPage == 1 ? theme.control__disabled : ''}`} />

                        { getPaginationElements() }

                        <div children={controlIcon} data-page='next'
                            className={`${theme.control} ${curPage == numberOfPages ? theme.control__disabled : ''}`} />
                    </>
                : null 
            }
        </div>
    )
}
Pagination.defaults = {
    theme: {
        root: componentID,
        separator: componentID + '_separator',
        control: componentID + '_control',
        control__active: componentID + '_control__active',
        control__disabled: componentID + '_control__disabled'
    },

    elementsBySide: 1,
    elementsByMiddle : 1,
    separator: '...'
}
Pagination.ID = componentID;


export * from './types'
export { componentID }
export default Pagination