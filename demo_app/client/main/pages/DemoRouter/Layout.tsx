import React from 'react'
import NavLink from 'siegel-router/Link'

import { pagePathMap } from 'app/Router'
import { linkTheme } from 'app/components'

import type { Layout as LayoutType } from 'siegel-router/types'

import styles from './styles.sass'


const layoutLinkClassName = `${linkTheme.link} ${styles.link}`

const pathPrefix = `/${pagePathMap.demo_router}`
const paramPage = `${pathPrefix}/some_param`
const paths = {
    nested: `${pathPrefix}/${pagePathMap.change_basename}`,
    withParam: `${paramPage}?param=param_value`,
    deepNested: `${paramPage}/deep_nested`
} as const

const Layout: LayoutType = ({ children }) => (
    <div className={ styles.demo_router_layout }>
        <div className={ styles.links }>
            <NavLink className={ layoutLinkClassName } href={ paths.nested }
                children='Change basename' />

            <NavLink className={ layoutLinkClassName } href={ paths.withParam }
                children='Parametrized page' />

            <NavLink className={ layoutLinkClassName } href={ paths.deepNested }
                children='Go to 3 level nested page' />
        </div>

        <div className={ styles.children } children={ children } />
    </div>
)


export default Layout