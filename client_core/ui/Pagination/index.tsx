import React from 'react'

import mergeTagAttributes from '../_internals/merge_tag_attributes'
import extractProps from '../_internals/props_extract'
import applyRefApi from '../_internals/ref_apply'
import type { Component, MergedProps } from './types'


type GetPageElement = (page: number, props: MergedProps) => JSX.Element

const componentID = '-ui-pagination'

const tokenPrevPage = 'p'
const tokenNextPage = 'n'

function getPaginatorRootProps(mergedProps: MergedProps, numberOfPages: number) {
    const { rootTagAttributes, curPage, onChange, payload, theme, refApi } = mergedProps

    let className = mergedProps.className
    numberOfPages == 1 && (className += ` ${theme._single}`)

    let result = {
        className,
        onMouseDown(e: React.MouseEvent) {
            const page = (e.target as HTMLDivElement).dataset.page

            if (page) {
                let newPage = curPage
                if (page == tokenPrevPage && curPage != 1) {
                    newPage--
                } else if (page == tokenNextPage && curPage != numberOfPages) {
                    newPage++
                } else if (0 < +page && +page <= numberOfPages) {
                    newPage = +page
                }

                curPage != newPage && onChange(newPage, e, payload)
            }
        },
        children: getPaginationVisuals(mergedProps, numberOfPages)
    }
    refApi && (applyRefApi(result, mergedProps))
    rootTagAttributes && (result = mergeTagAttributes(result, rootTagAttributes))


    return result
}

const getPageElement: GetPageElement = (page: number, { curPage, theme }) => (
    <div className={ `${theme.page} ${page == curPage ? theme.page__active : ''}` }
        key={ page } data-page={ page } children={ page } />
)

function fillGap(start: number, end: number, result: JSX.Element[], props: MergedProps, isLastGap?: boolean) {
    const { theme, separator } = props

    const elementToPush = (start - end) == 1
        ?   getPageElement(isLastGap ? start : end, props)
        :   <div key={ isLastGap ? tokenNextPage : tokenPrevPage } className={ theme.separator }
                children={ separator } />

    result.push(elementToPush)
}

function getElementsRange(from: number, to: number, result: JSX.Element[], props: MergedProps) {
    for (let i = from; i <= to; i++) {
        result.push(getPageElement(i, props))
    }
}

function getPaginationVisuals(mergedProps: MergedProps, numberOfPages: number) {
    const {
        theme, elementsByMiddle, elementsBySide, iconPrev, iconNext, curPage, fixedWidth
    } = mergedProps

    const middlePluseSide = elementsByMiddle + elementsBySide
    const maxLength = middlePluseSide * 2 + 3
    const result: JSX.Element[] = []


    if (maxLength > numberOfPages) getElementsRange(1, numberOfPages, result, mergedProps)
    else {
        let from = curPage - elementsByMiddle
        const minFrom = elementsBySide + 1

        let to = curPage + elementsByMiddle
        const maxTo = numberOfPages - elementsBySide


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
        <div children={ iconPrev } data-page={ tokenPrevPage }
            className={ `${theme.icon_prev} ${curPage == 1 ? theme.icon__disabled : ''}` } />

        { result }

        <div children={ iconNext } data-page={ tokenNextPage }
            className={ `${theme.icon_next} ${curPage == numberOfPages ? theme.icon__disabled : ''}` } />
    </>
}

const Pagination: Component = (props, noDefaults) => {
    const mergedProps = noDefaults
        ?   extractProps(Pagination.defaults, props, false)
        :   (props as MergedProps)

    const { listLength, showPerPage } = mergedProps

    const numberOfPages = Math.ceil(listLength / showPerPage) || 1


    return <div { ...getPaginatorRootProps(mergedProps, numberOfPages) } />
}
Pagination.defaults = {
    theme: {
        root: '',
        _single: '',
        separator: '',
        icon_prev: '',
        icon_next: '',
        icon__disabled: '',
        page: '',
        page__active: ''
    },
    iconPrev: '<',
    iconNext: '>',
    elementsBySide: 1,
    elementsByMiddle : 1,
    separator: '...',
    fixedWidth: true
}
Pagination.ID = componentID


export { componentID }
export default Pagination
export * from './types'