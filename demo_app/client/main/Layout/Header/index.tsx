import React from 'react'
import { Link } from 'react-router-dom'

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
    <Link key={ path } to={ '/' + path } children={ label } className={ styles.nav_link } />
))

const Header = () => (
    <header className={ styles.header }>
        <nav children={ nav } />

        <Breadcrumbs className={ styles.breadcrumbs } />
    </header>
)


export default Header