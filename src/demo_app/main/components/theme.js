import React from 'react'

import Select, { setDefaults as setSelectDefaults } from 'core-ui/Select'
import selectTheme from 'app/styles/theme/select'

import Input, { setDefaults as setInputDefaults } from 'core-ui/Input'
import inputTheme from 'app/styles/theme/input'

import Checkbox, { setDefaults as setCheckboxDefaults } from 'core-ui/Checkbox'
import checkboxTheme from 'app/styles/theme/checkbox'

import Button, { setDefaults as setButtonDefaults } from 'core-ui/Button'
import buttonTheme from 'app/styles/theme/button'

import Table, { setDefaults as setTableDefaults } from 'core-ui/Table'
import tableTheme from 'app/styles/theme/table'

import Calendar, { setTheme as setCalendarTheme } from 'core-ui/Calendar'
import calendarTheme from 'core-ui/Calendar/theme_fa'
import calendarAppTheme from 'app/styles/theme/calendar'

import Pagination, { setDefaults as setPaginationDefaults } from 'core-ui/Pagination'
import paginationAppTheme from 'app/styles/theme/pagination'

import iconStyles from 'app/styles/icons'


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

setCalendarTheme({
    ...calendarTheme,
    ...calendarAppTheme
})

setPaginationDefaults({
    controlIcon: dropdownIcon,
    theme: paginationAppTheme
})


export {
    Select, Input, Checkbox, Button, Table, Calendar, Pagination,
    selectTheme, inputTheme, checkboxTheme, buttonTheme, tableTheme, paginationAppTheme
}