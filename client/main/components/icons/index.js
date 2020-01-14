import React from 'react'

import TrashDeletedIcon from './trash_deleted'

import s from './styles'


const icons = {
    trashDeleted: <TrashDeletedIcon />
}

let iconNames = ['Eye_enable', 'Users']
iconNames.forEach(name => {
    icons[name] = <i className={s[name.toLowerCase()]} />
})


export default icons