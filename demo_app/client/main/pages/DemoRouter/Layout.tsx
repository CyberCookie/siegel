import React from 'react'
import NavLink from 'siegel-router/Link'

import { pagePathMap } from 'app/Router'
import { linkTheme } from 'app/components'

import type { Layout as LayoutType } from 'siegel-router/types'

import styles from './styles.sass'


const layoutLinkClassName = `${linkTheme.link} ${styles.link}`

const pathPrefix = `/${pagePathMap.demo_router}`
const paths = {
    nested: `${pathPrefix}/${pagePathMap.change_basename}`,
    withParam: `${pathPrefix}/some_param`
} as const

const Layout: LayoutType = ({ children }) => {
    return (
        <div className={ styles.demo_router_layout }>
            <div className={ styles.links }>
                <NavLink className={ layoutLinkClassName } href={ paths.nested }
                    children='Change basename' />

                <NavLink className={ layoutLinkClassName } href={ paths.withParam }
                    children='Parametrized page' />

                <NavLink className={ layoutLinkClassName } href={ `${paths.withParam}/deep_nested` }
                    children='Go to 3 level nested page' />
            </div>

            <div className={ styles.children } children={ children } />
        </div>
    )
}


export default Layout