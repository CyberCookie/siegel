import React from 'react'


type ThemeWithChildren = {
    children?: string
}


const addChildren = (children: React.ReactNode, theme: ThemeWithChildren) => (
    <div className={ theme.children } children={ children } />
)


export default addChildren