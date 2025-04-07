import React, { useLayoutEffect, useState } from 'react'

import isExists from '../../../common/is/exists'
import component from '../../ui/_internals/component'
import applyRefApi from '../../ui/_internals/ref_apply'
import { BASENAME_UPDATE_EVENT_TYPE } from '../constants'
import getFinalURL from '../get_final_url'

import type { Component, Props } from './types'


const componentID = '-ui-internal_link'

const NavLink: Component = component(
    componentID,
    {},
    props => {

        const {
            href, activeClassName, refApi, onClick,
            state = null
        } = props

        if (isExists(history.basename)) {
            const [ counter, setCounter ] = useState(0)

            useLayoutEffect(() => {
                function rerenderDueToNewBasename() {
                    setCounter(counter + 1)
                }

                addEventListener(BASENAME_UPDATE_EVENT_TYPE, rerenderDueToNewBasename)
                return () => {
                    removeEventListener(BASENAME_UPDATE_EVENT_TYPE, rerenderDueToNewBasename)
                }
            }, [ history.basename ])
        }


        const { pathname } = location
        const finalHref = getFinalURL(pathname, href)

        const finalProps = {
            ...props,
            onClick(e: React.MouseEvent) {
                onClick?.(e)

                if (!e.defaultPrevented) {
                    e.preventDefault()
                    history.push!(finalHref, state)
                }
            },
            href: finalHref
        }
        if (activeClassName && pathname == finalHref) {
            finalProps.className
                ?   (finalProps.className += ` ${activeClassName}`)
                :   (finalProps.className = activeClassName)
        }
        delete finalProps['activeClassName']

        refApi && (applyRefApi(finalProps, props))


        return <a { ...finalProps } />
    }
)


export default NavLink
export { componentID }
export type { Component, Props }