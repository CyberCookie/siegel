import React from 'react'
import NavLink from 'siegel-router/Link'

import { Breadcrumbs, linkTheme } from 'app/components'
import { pagePathMap } from 'app/Router/config'

import styles from './styles.sass'


const nav = ([
    {
        path: pagePathMap.home,
        label: 'Home'
    },
    {
        path: pagePathMap.demo_components,
        label: 'Components'
    },
    {
        path: pagePathMap.demo_api,
        label: 'Store + API'
    },
    {
        path: pagePathMap.demo_router,
        label: 'Router'
    }
]).map(({ path, label }) => (
    <NavLink key={ path } href={ `/${path}` } className={ linkTheme.link }
        children={ label } />
))

const Header = () => (
    <header className={ styles.header }>
        <nav children={ nav } />

        <Breadcrumbs className={ styles.breadcrumbs } />
    </header>
)


export default Header