import React from 'react'

import styles from './styles.sass'


const iconNames = ['check', 'chevron', 'close', 'more_vert', 'search', 'edit']

const icons: Partial<Record<typeof iconNames[number], React.ReactElement>> = {}
iconNames.forEach(name => {
    icons[name] = <i className={`${styles._icon} ${styles[name]}`} />
})


export default icons