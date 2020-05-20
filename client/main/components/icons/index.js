import React from 'react'

import TrashDeletedIcon from './trash_deleted'

import s from './styles'


const icons = {
    trashDeleted: <TrashDeletedIcon />
}

const iconNames = ['eye_enable', 'users']
iconNames.forEach(name => {
    icons[name] = <i className={s[name]} />
})


export default icons