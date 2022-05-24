import React from 'react'
import type { Layout as LayoutType } from 'siegel-router/types'
import NavLink from 'siegel-router/Link'

import { pagePathMap } from 'app/Router'
import { linkTheme } from 'app/components'

import uplevelLayoutStyles from '../../styles.sass'
import styles from './styles.sass'


const deepLayoutLinkClassName = `${linkTheme.link} ${styles.link}`
const wrapperClassName = `${uplevelLayoutStyles.demo_router_layout} ${styles.layout_wrapper}`

const pathPrefix = `/${pagePathMap.demo_router}/some_param/${pagePathMap.deep_nested}`
const paths = {
    anotherDeepNested: `${pathPrefix}/${pagePathMap.another_deep_nested}`,
    noPermissions: `${pathPrefix}/${pagePathMap.no_permissions}`,
    unexisted: `${pathPrefix}/unexisted_page/unexisted`
} as const

const Layout: LayoutType = ({ children }) => {
    return (
        <div className={ wrapperClassName }>
            <div className={ uplevelLayoutStyles.links }>
                <NavLink className={ deepLayoutLinkClassName } href={ pathPrefix }
                    children='Deeply nested page' />

                <NavLink className={ deepLayoutLinkClassName } href={ paths.anotherDeepNested }
                    children='Another deeply nested page' />

                <NavLink className={ deepLayoutLinkClassName } href={ paths.unexisted }
                    children='Unexisted page' />

                <NavLink className={ deepLayoutLinkClassName } href={ paths.noPermissions }
                    children='No permissions page' />
            </div>

            <div className={ uplevelLayoutStyles.children }
                children={ children } />
        </div>
    )
}


export default Layout