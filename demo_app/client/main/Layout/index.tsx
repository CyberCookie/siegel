import React from 'react'

import Header from './Header'

import type { Layout as LayoutType } from 'siegel-router/types'

import './styles.sass'


const Layout: LayoutType = props => {
    return <>
        <Header />
        <main children={ props.children } />
    </>
}


export default Layout