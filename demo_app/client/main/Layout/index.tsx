import React from 'react'
import type { Layout as LayoutType } from 'siegel-router'

import Header from './Header'

import './styles.sass'


const Layout: LayoutType = props => {
    return <>
        <Header />
        <main children={ props.children } />
    </>
}


export default Layout