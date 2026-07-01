import React from 'react'

import Header from './Header'

import type { LayoutType } from 'siegel-router'

import './styles.sass'


const Layout: LayoutType = props => (
    <>
        <Header />
        <main children={ props.children } />
    </>
)


export default Layout