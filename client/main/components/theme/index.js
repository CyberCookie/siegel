import React from 'react'

import Select, { setDefaults as setSelectDefaults } from 'core-ui/Select'
import selectTheme from './styles/select'

import Input, { setDefaults as setInputDefaults } from 'core-ui/Input'
import inputTheme from './styles/input'

import Checkbox, { setDefaults as setCheckboxDefaults } from 'core-ui/Checkbox'
import checkboxTheme from './styles/checkbox'

import Button, { setDefaults as setButtonDefaults } from 'core-ui/Button'
import buttonTheme from './styles/button'

import Table, { setDefaults as setTableDefaults } from 'core-ui/Table'
import tableTheme from './styles/table'

import Pagination, { setDefaults as setPaginationDefaults } from 'core-ui/Pagination'
import paginationAppTheme from './styles/pagination'

import iconStyles from '../icons/styles'


const dropdownIcon = <i className={iconStyles.dropdown} />;

setButtonDefaults({
    className: buttonTheme.button
})

setSelectDefaults({
    theme: selectTheme,
    dropdownIcon
})

setInputDefaults({
    theme: inputTheme
})

setCheckboxDefaults({
    theme: checkboxTheme
})

setTableDefaults({
    className: tableTheme.table
})

setPaginationDefaults({
    controlIcon: dropdownIcon,
    theme: paginationAppTheme
})


export {
    Select, Input, Checkbox, Button, Table, Pagination,
    selectTheme, inputTheme, checkboxTheme, buttonTheme, tableTheme, paginationAppTheme
}