import React from 'react'
import { SwitchProps, RouteComponentProps } from 'react-router-dom'

import Header from './Header'

import './styles.sass'


const Layout = (props: SwitchProps & RouteComponentProps) => {
    return <>
        <Header />
        <main children={ props.children } />
    </>
}


export default Layout