import React from 'react'
import A from 'siegel-router/Link'

import { Breadcrumbs } from 'app/components'
import { pagePathMap } from 'app/Router'

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
    }
]).map(({ path, label }) => (
    <A key={ path } href={ `/${path}` } className={ styles.nav_link }
        children={ label } />
))

const Header = () => (
    <header className={ styles.header }>
        <nav children={ nav } />

        <Breadcrumbs className={ styles.breadcrumbs } />
    </header>
)


export default Header