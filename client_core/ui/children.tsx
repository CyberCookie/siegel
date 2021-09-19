import React from 'react'

import type { ComponentAttributes } from './ui_utils'


type ThemeWithChildren = {
    children: string
}


function addChildren(componentRootProps: ComponentAttributes, theme: ThemeWithChildren) {
    if (componentRootProps.children) {
        return <div className={ theme.children } children={ componentRootProps.children } />
    }
}


export default addChildren