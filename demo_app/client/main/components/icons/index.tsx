import React from 'react'

import styles from './styles.sass'


type IconName = typeof iconNames[number]


const iconNames = [
    'check',
    'chevron',
    'close',
    'more_vert',
    'search',
    'edit',
    'git'
] as const

const icons: Partial<Record<IconName, React.ReactElement>> = {}
iconNames.forEach(name => {
    icons[name] = <i className={ `${styles._icon} ${styles[name]}` } />
})


export default icons as Required<typeof icons>
export type { IconName }