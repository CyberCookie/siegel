import { withDefaults } from 'siegel-ui/ui_utils'

import _Button from 'siegel-ui/_form/Button'
import _Calendar from 'siegel-ui/_form/Calendar'
import _Checkbox from 'siegel-ui/_form/Checkbox'
import Clocks from 'siegel-ui/Clocks'
import _DataTable from 'siegel-ui/DataTable'
import _Dropdown from 'siegel-ui/Dropdown'
import _DropdownSearch from 'siegel-ui/_form/DropdownSearch'
import _Input from 'siegel-ui/_form/Input'
import _NumberPicker from 'siegel-ui/_form/NumberPicker'
import _Pagination from 'siegel-ui/Pagination'
import _Popup from 'siegel-ui/Popup'
import _Radio from 'siegel-ui/_form/Radio'
import _Select from 'siegel-ui/_form/Select'
import _Slider from 'siegel-ui/Slider'
import _Table from 'siegel-ui/Table'
import _Tabs from 'siegel-ui/Tabs'
import _Toggle from 'siegel-ui/_form/Toggle'
import Swipe from 'siegel-ui/Swipe'


import * as icons from '../icons'

import buttonTheme from './styles/button.sass'
import calendarTheme from './styles/calendar.sass'
import checkboxTheme from './styles/checkbox.sass'
import _dataTableTheme from './styles/data_table.sass'
import dropdownTheme from './styles/dropdown.sass'
import _dropdownSearchTheme from './styles/dropdown_search.sass'
import inputTheme from './styles/input.sass'
import _numberPickerTheme from './styles/number_picker.sass'
import paginationTheme from './styles/pagination.sass'
import popupTheme from './styles/popup.sass'
import radioTheme from './styles/radio.sass'
import _selectTheme from './styles/select.sass'
import sliderTheme from './styles/slider.sass'
import tableTheme from './styles/table.sass'
import tabsTheme from './styles/tabs.sass'
import toggleTheme from './styles/toggle.sass'


const Button = withDefaults(_Button, { className: buttonTheme.button })

const Calendar = withDefaults(_Calendar, {
    theme: calendarTheme,
    prevIcon: icons.chevron,
    nextIcon: icons.chevron
})

const Checkbox = withDefaults(_Checkbox, {
    theme: checkboxTheme,
    icon: icons.check
})


const dataTableTheme = {
    ..._dataTableTheme,
    table: `${tableTheme.table} ${_dataTableTheme.table}`
}

const DataTable = withDefaults(_DataTable, {
    theme: dataTableTheme
})


const Dropdown = withDefaults(_Dropdown, {
    theme: dropdownTheme,
    dropdownIcon: icons.chevron
})


const dropdownSearchTheme = {
    root: _dropdownSearchTheme.dropdown_search,
    field: `${inputTheme.field} ${_dropdownSearchTheme.field}`,
    label_text: inputTheme.label_text,
    options: `${_selectTheme.options} ${_dropdownSearchTheme.options}`,
    option: _selectTheme.option,
    _focused: inputTheme._focused,
    _disabled: _dropdownSearchTheme._disabled,
    _with_suggestions: _dropdownSearchTheme._with_suggestions
}
const DropdownSearch = withDefaults(_DropdownSearch, {
    theme: dropdownSearchTheme
})


const Input = withDefaults(_Input, { theme: inputTheme })


const numberPickerTheme = {
    ..._numberPickerTheme,
    field: `${inputTheme.field} ${_numberPickerTheme.field}`,
    label: inputTheme.label_text
}

const NumberPicker = withDefaults(_NumberPicker, {
    theme: numberPickerTheme,
    minusIcon: icons.chevron,
    plusIcon: icons.chevron
})


const Pagination = withDefaults(_Pagination, {
    theme: paginationTheme,
    controlIcon: icons.chevron,
    separator: '---'
})

const Popup = withDefaults(_Popup, {
    theme: popupTheme,
    closeIcon: icons.close
})

const Radio = withDefaults(_Radio, {
    theme: radioTheme
})


const selectTheme = {
    ..._selectTheme,
    title: `${inputTheme.field} ${_selectTheme.title}`,
    label: inputTheme.label_text
}
const Select = withDefaults(_Select, {
    theme: selectTheme,
    dropdownIcon: icons.chevron
})


const Slider = withDefaults(_Slider, { theme: sliderTheme })

const Table = withDefaults(_Table, { className: tableTheme.table })

const Toggle = withDefaults(_Toggle, { theme: toggleTheme })

const Tabs = withDefaults(_Tabs, { theme: tabsTheme })


export {
    buttonTheme, Button,
    calendarTheme, Calendar,
    checkboxTheme, Checkbox,
    dataTableTheme, DataTable,
    Clocks,
    Swipe,
    dropdownTheme, Dropdown,
    dropdownSearchTheme, DropdownSearch,
    inputTheme, Input,
    numberPickerTheme, NumberPicker,
    paginationTheme, Pagination,
    popupTheme, Popup,
    radioTheme, Radio,
    selectTheme, Select,
    sliderTheme, Slider,
    tableTheme, Table,
    toggleTheme, Toggle,
    tabsTheme, Tabs
}