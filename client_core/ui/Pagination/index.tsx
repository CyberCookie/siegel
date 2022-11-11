import React from 'react'

import resolveTagAttributes from '../_internals/resolve_tag_attributes'
import applyClassName from '../_internals/apply_classname'
import component from '../_internals/component'
import applyRefApi from '../_internals/ref_apply'

import type { DivTagAttributes } from '../_internals/types'
import type {
    Component, Props, DefaultProps, MergedProps, GetPageElement
} from './types'


const _undef = undefined
const componentID = '-ui-pagination'

const tokenPrevPage = 'p'
const tokenNextPage = 'n'

function getPaginatorRootProps(mergedProps: MergedProps, numberOfPages: number) {
    const {
        rootTagAttributes, curPage, payload, theme, className,
        onChange, onMouseDown
    } = mergedProps

    let result: DivTagAttributes = {
        className: applyClassName(className, [[ theme._single, numberOfPages == 1 ]]),
        onMouseDown(e) {
            onMouseDown?.(e)
            if (!e.defaultPrevented) {

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
            }
        },
        children: getPaginationVisuals(mergedProps, numberOfPages)
    }
    applyRefApi(result, mergedProps)
    result = resolveTagAttributes(result, rootTagAttributes)


    return result
}

const getPageElement: GetPageElement = (page: number, { curPage, theme }) => (
    <div className={ applyClassName(theme.page, [[ theme.page__active, page == curPage ]]) }
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
            className={ applyClassName(theme.icon_prev, [[ theme.icon__disabled, curPage == 1 ]]) } />

        { result }

        <div children={ iconNext } data-page={ tokenNextPage }
            className={ applyClassName(theme.icon_next, [[ theme.icon__disabled, curPage == numberOfPages ]]) } />
    </>
}

const Pagination = component<Props, DefaultProps>(
    componentID,
    {
        theme: {
            root: _undef,
            _single: _undef,
            separator: _undef,
            icon_prev: _undef,
            icon_next: _undef,
            icon__disabled: _undef,
            page: _undef,
            page__active: _undef
        },
        elementsBySide: 1,
        elementsByMiddle : 1,
        fixedWidth: true
    },
    props => {

        const { listLength, showPerPage } = props

        const numberOfPages = Math.ceil(listLength / showPerPage) || 1


        return <div { ...getPaginatorRootProps(props, numberOfPages) } />
    }
)


export default Pagination
export { componentID }
export type { Component, Props }