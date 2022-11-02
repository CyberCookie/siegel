import React from 'react'

import isExists from '../../../common/is/exists'


type ThemeWithChildren = {
    children?: string
}


const addChildren = (children: React.ReactNode, theme: ThemeWithChildren) => (
    isExists(children) && <div className={ theme.children } children={ children } />
)


export default addChildren