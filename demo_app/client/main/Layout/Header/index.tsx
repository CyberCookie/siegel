import React from 'react'
import { NavLink } from 'react-router-dom'

import { pagePathMap } from 'app/routes'

import styles from './styles.sass'


const navigationConfig = [
    {
        path: pagePathMap.home,
        label: 'Home'
    },
    {
        path: pagePathMap.demo_components,
        label: 'Demo components'
    },
    {
        path: pagePathMap.demo_api,
        label: 'Demo API'
    }
]

const Header = () => {
    const navs = navigationConfig.map(({ path, label }) => (
        <NavLink key={path} to={path} children={label}
            activeClassName={styles.active_nav} />
    ))
    
    return <header className={styles.header} children={navs} />
}


export default Header