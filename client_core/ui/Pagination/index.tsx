import React from 'react'

import { extractProps, applyRefApi } from '../ui_utils'
import type { _Pagination, MergedProps } from './types'


type GetPageElement = (page: number, props: MergedProps) => JSX.Element;

const componentID = '-ui-pagination'

const tokenPrevPage = 'p'
const tokenNextPage = 'n'

function getPaginatorRootProps(mergedProps: MergedProps, numberOfPages: number) {
    const { attributes, curPage, onChange, payload, theme, refApi } = mergedProps;
    
    let className = mergedProps.className;
    numberOfPages == 1 && (className += ` ${theme._single}`)

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
    refApi && (applyRefApi(result, mergedProps))
    attributes && (result = Object.assign(result, attributes))


    return result
}

const getPageElement: GetPageElement = (page: number, { curPage, theme }) => (
    <div className={`${theme.control} ${page == curPage ? theme.control__active : '' }`}
        key={page} data-page={page} children={page} />
)

function fillGap(start: number, end: number, result: JSX.Element[], props: MergedProps, isLastGap?: boolean) {
    const { theme, separator } = props;

    const elementToPush = (start - end) == 1
        ?   getPageElement(isLastGap ? start : end, props)
        :   <div key={isLastGap ? tokenNextPage : tokenPrevPage} className={theme.separator} children={separator} />

    result.push(elementToPush)
}

function getElementsRange(from: number, to: number, result: JSX.Element[], props: MergedProps) {
    for (let i = from; i <= to; i++) {
        result.push(getPageElement(i, props))
    }
}

function getPaginationVisuals(mergedProps: MergedProps, numberOfPages: number) {
    const { theme, elementsByMiddle, elementsBySide, controlIcon, curPage, fixedWidth } = mergedProps;
    
    const middlePluseSide = elementsByMiddle + elementsBySide;
    const maxLength = middlePluseSide * 2 + 3
    const result: JSX.Element[] = []
    

    if (maxLength > numberOfPages) getElementsRange(1, numberOfPages, result, mergedProps)
    else {
        let from = curPage - elementsByMiddle;
        const minFrom = elementsBySide + 1
        
        let to = curPage + elementsByMiddle;
        const maxTo = numberOfPages - elementsBySide;
    
        
        getElementsRange(1, elementsBySide, result, mergedProps)


        if (from > minFrom) fillGap(from, minFrom, result, mergedProps)
        else if (fixedWidth) {
            to += (maxLength - middlePluseSide - curPage - 1)
        }

        from <= elementsBySide && (from = minFrom)
        to > maxTo && (to = maxTo)

        if (fixedWidth) {
            const shouldShrinkCount = numberOfPages - middlePluseSide - 1
            if (curPage > shouldShrinkCount) {
                from += (shouldShrinkCount - curPage)
            }
        }


        getElementsRange(from, to, result, mergedProps)

        to < maxTo && fillGap(maxTo, to, result, mergedProps, true)

        getElementsRange(maxTo + 1, numberOfPages, result, mergedProps)
    }
    

    return <>
        <div children={controlIcon} data-page={tokenPrevPage}
            className={`${theme.control} ${curPage == 1 ? theme.control__disabled : ''}`} />

        { result }

        <div children={controlIcon} data-page={tokenNextPage}
            className={`${theme.control} ${curPage == numberOfPages ? theme.control__disabled : ''}`} />
    </>
}

const Pagination: _Pagination = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Pagination.defaults, props, false)
        :   (props as MergedProps)
    
    const { listLength, showPerPage } = mergedProps;

    const numberOfPages = Math.ceil(listLength / showPerPage) || 1
    

    return (
        <div {...getPaginatorRootProps(mergedProps, numberOfPages)}
            children={getPaginationVisuals(mergedProps, numberOfPages)} />
    )
}
Pagination.defaults = {
    theme: {
        root: componentID,
        separator: componentID + '_separator',
        control: componentID + '_control',
        control__active: componentID + '_control__active',
        control__disabled: componentID + '_control__disabled',
        _single: componentID + '_single'
    },

    elementsBySide: 1,
    elementsByMiddle : 1,
    separator: '...',
    fixedWidth: true
}
Pagination.ID = componentID;


export { componentID }
export default Pagination
export * from './types'