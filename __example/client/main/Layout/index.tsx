import React from 'react'
import { SwitchProps, RouteComponentProps } from 'react-router-dom'

import './styles'


const Layout = (props: SwitchProps & RouteComponentProps) => {
    return <main children={props.children} />
}


export default Layout