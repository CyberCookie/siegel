// export { default as icon } from './Icon'
// export { default as chevron } from './Chevron'
// export { default as check } from './Check'
// export { default as close } from './Close'
// export { default as moreVert } from './MoreVert'
// export { default as search } from './Search'

import React from 'react'

import styles from './styles.sass'


const icons: Indexable = {}
const iconNames = ['eye_enable', 'users']
iconNames.forEach(name => {
    icons[name] = <i className={`${styles._icon} ${styles[name]}`} />
})


export default icons