import { withDefaults } from 'siegel-ui/ui_utils'

import _Button, { Props as ButtonProps } from 'siegel-ui/_form/Button'
import _Breadcrumbs, { Props as BreadcrumbsProps } from 'siegel-ui/Breadcrumbs'
import _Calendar, { Props as CalendarProps } from 'siegel-ui/_form/Calendar'
import _Checkbox, { Props as CheckboxProps } from 'siegel-ui/_form/Checkbox'
import Clocks, { Props as ClocksProps } from 'siegel-ui/Clocks'
import _DataTable, { Props as DataTableProps } from 'siegel-ui/DataTable'
import _Accordion, { Props as AccordionProps } from 'siegel-ui/Accordion'
import _DropdownSearch, { Props as DropdownSearchProps } from 'siegel-ui/_form/DropdownSearch'
import _Input, { Props as InputProps } from 'siegel-ui/_form/Input'
import _NumberPicker, { Props as NumberPickerProps } from 'siegel-ui/_form/NumberPicker'
import _Pagination, { Props as PaginationProps } from 'siegel-ui/Pagination'
import _Popup, { Props as PopupProps } from 'siegel-ui/Popup'
import _Radio, { Props as RadioProps } from 'siegel-ui/_form/Radio'
import _Select, { Props as SelectProps } from 'siegel-ui/_form/Select'
import _Slider, { Props as SliderProps } from 'siegel-ui/Slider'
import _Table, { Props as TableProps } from 'siegel-ui/Table'
import _Tabs, { Props as TabsProps } from 'siegel-ui/Tabs'
import _Toggle, { Props as ToggleProps } from 'siegel-ui/_form/Toggle'
import Swipe, { Props as SwipeProps } from 'siegel-ui/Swipe'
import _Ranger, { Props as RangerProps } from 'siegel-ui/_form/Ranger'


import { routesConfig, history } from 'app/Router/config'
import icons from '../icons'

import buttonTheme from './styles/button.sass'
import breadcrumbsTheme from './styles/breadcrumbs.sass'
import calendarTheme from './styles/calendar.sass'
import checkboxTheme from './styles/checkbox.sass'
import _dataTableTheme from './styles/data_table.sass'
import accordionTheme from './styles/accordion.sass'
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
import rangerTheme from './styles/ranger.sass'



const Button = withDefaults(_Button, { className: buttonTheme.button })

const Breadcrumbs = withDefaults(_Breadcrumbs, {
    history,
    hasDynamicCrumbs: true,
    theme: breadcrumbsTheme,
    separator: icons.chevron,
    config: routesConfig
})

const Calendar = withDefaults(_Calendar, {
    theme: calendarTheme,
    prevIcon: icons.chevron,
    nextIcon: icons.chevron
})

const Checkbox = withDefaults(_Checkbox, {
    theme: checkboxTheme,
    icon: icons.check
})


const dataTableTheme: DataTableProps<any>['theme'] = Object.assign(_dataTableTheme, {
    table: `${tableTheme.table} ${_dataTableTheme.table}`
})
const DataTable = withDefaults(_DataTable, {
    theme: dataTableTheme
})


const Accordion = withDefaults(_Accordion, {
    theme: accordionTheme,
    accordionIcon: icons.chevron
})


const dropdownSearchTheme: DropdownSearchProps['theme'] = {
    root: _dropdownSearchTheme.dropdown_search,
    options: `${_selectTheme.options} ${_dropdownSearchTheme.options}`,
    option: _selectTheme.option,
    _disabled: _dropdownSearchTheme._disabled,
    _with_suggestions: _dropdownSearchTheme._with_suggestions
}
const DropdownSearch = withDefaults(_DropdownSearch, {
    theme: dropdownSearchTheme,
    inputProps: {
        theme: {
            field: `${inputTheme.field} ${_dropdownSearchTheme.field}`,
            label_text: inputTheme.label_text,
            _focused: inputTheme._focused
        }
    }
})


const Input = withDefaults(_Input, { theme: inputTheme })


const numberPickerTheme: NumberPickerProps['theme'] = Object.assign(_numberPickerTheme, {
    field: `${inputTheme.field} ${_numberPickerTheme.field}`,
    label: inputTheme.label_text
})
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


const selectTheme: SelectProps['theme'] = Object.assign(_selectTheme, {
    title: `${inputTheme.field} ${_selectTheme.title}`,
    label: inputTheme.label_text
})
const Select = withDefaults(_Select, {
    theme: selectTheme,
    dropdownIcon: icons.chevron
})


const Slider = withDefaults(_Slider, { theme: sliderTheme })

const Table = withDefaults(_Table, { className: tableTheme.table })

const Toggle = withDefaults(_Toggle, { theme: toggleTheme })

const Tabs = withDefaults(_Tabs, { theme: tabsTheme })

const Ranger = withDefaults(_Ranger, {
    theme: rangerTheme,
    rangePickIcon: ''
})



export {
    buttonTheme, ButtonProps, Button,
    breadcrumbsTheme, BreadcrumbsProps, Breadcrumbs,
    calendarTheme, CalendarProps, Calendar,
    checkboxTheme, CheckboxProps, Checkbox,
    dataTableTheme, DataTableProps, DataTable,
    ClocksProps, Clocks,
    SwipeProps, Swipe,
    accordionTheme, AccordionProps, Accordion,
    dropdownSearchTheme, DropdownSearchProps, DropdownSearch,
    inputTheme, InputProps, Input,
    numberPickerTheme, NumberPickerProps, NumberPicker,
    paginationTheme, PaginationProps, Pagination,
    popupTheme, PopupProps, Popup,
    radioTheme, RadioProps, Radio,
    selectTheme, SelectProps, Select,
    sliderTheme, SliderProps, Slider,
    tableTheme, TableProps, Table,
    toggleTheme, ToggleProps, Toggle,
    tabsTheme, TabsProps, Tabs,
    rangerTheme, RangerProps, Ranger
}