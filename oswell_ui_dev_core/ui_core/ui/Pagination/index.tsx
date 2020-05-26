import React from 'react'

import { extractProps } from '../ui_utils'
import { _Pagination, Props, DefaultProps } from './types'


type MergedProps = Props & DefaultProps


const componentID = '-ui-pagination'

const tokenNextPage = 'next'
const tokenPrevPage = 'prev'

function getPaginatorRootProps(mergedProps: MergedProps, numberOfPages: number, isSinglePage: boolean) {
    const { attributes, curPage, onChange, payload, theme } = mergedProps;
    
    let className = mergedProps.className;
    numberOfPages && (className += ` ${theme.single}`)

    let result = {
        className,
        onMouseDown(e: React.MouseEvent) {
            const page = (e.target as HTMLDivElement).dataset.page;
    
            if (page) {
                let newPage = curPage;
                if (page == tokenPrevPage && curPage != 1) {
                    newPage--
                } else if (page == tokenNextPage && curPage != numberOfPages) {
                    newPage++
                } else if (0 < +page && +page <= numberOfPages) {
                    newPage = +page
                }
    
                curPage != newPage && onChange(newPage, e, payload)
            }
        }
    }
    attributes && (result = Object.assign(result, attributes))


    return result
}

const getPageElement = (page: number, theme: MergedProps['theme'], curPage: number) => (
    <div className={`${theme.control} ${page == curPage ? theme.control__active : '' }`}
        key={page} data-page={page} children={page} />
)

const getSeparator = (key: string, theme: MergedProps['theme'], separator: MergedProps['separator']) => (
    <div children={separator} key={key} className={theme.separator} />
)

function getPaginationVisuals(mergedProps: MergedProps, numberOfPages: number, isSinglePage: boolean, curPage: number) {
    const { theme, separator, elementsByMiddle, elementsBySide, controlIcon } = mergedProps;
    const result = []
    
    let from = curPage - elementsByMiddle;
    const minFrom = elementsBySide + 1;
    
    let to = curPage + elementsByMiddle;
    const maxTo = numberOfPages - elementsBySide;


    for (let i = 1; i <= elementsBySide; i++) {
        result.push(getPageElement(i, theme, curPage))
    }
    from > minFrom && result.push(getSeparator(tokenPrevPage, theme, separator))

    from <= elementsBySide && (from = minFrom)
    to > maxTo && (to = maxTo)
    for (let i = from; i <= to; i++) {
        result.push(getPageElement(i, theme, curPage))
    }
    
    to < maxTo && result.push(getSeparator(tokenNextPage, theme, separator))
    for (let i = maxTo + 1; i <= numberOfPages; i++) {
        result.push(getPageElement(i, theme, curPage))
    }
    

    return (
        <>
            <div children={controlIcon} data-page={tokenPrevPage}
                className={`${theme.control} ${curPage == 1 ? theme.control__disabled : ''}`} />

            { result }

            <div children={controlIcon} data-page={tokenNextPage}
                className={`${theme.control} ${curPage == numberOfPages ? theme.control__disabled : ''}`} />
        </>
    )
}

const Pagination: _Pagination = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Pagination.defaults, props)
        :   (props as _Pagination['defaults'] & typeof props)
    
    const { listLength, curPage, showPerPage } = mergedProps;

    const numberOfPages = Math.ceil(listLength / showPerPage)
    const isSinglePage = numberOfPages == 1


    return (
        <div {...getPaginatorRootProps(mergedProps, numberOfPages, isSinglePage)}>
            { getPaginationVisuals(mergedProps, numberOfPages, isSinglePage, curPage) }
        </div>
    )
}
Pagination.defaults = {
    theme: {
        root: componentID,
        single: componentID + '_single',
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


export { componentID }
export default Pagination