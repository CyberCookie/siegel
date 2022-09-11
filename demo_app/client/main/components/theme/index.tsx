import withDefaults from 'siegel-ui/with_defaults'

import ErrorBoundary from 'siegel-ui/ErrorBoundary'
import _Button, { Props as ButtonProps } from 'siegel-ui/Button'
import _Breadcrumbs, { Props as BreadcrumbsProps } from 'siegel-ui/Breadcrumbs'
import _Calendar, { Props as CalendarProps } from 'siegel-ui/Calendar'
import _Checkbox, { Props as CheckboxProps } from 'siegel-ui/Checkbox'
import Clocks, { Props as ClocksProps } from 'siegel-ui/Clocks'
import _DataTable, { Props as DataTableProps } from 'siegel-ui/DataTable'
import _Accordion, { Props as AccordionProps } from 'siegel-ui/Accordion'
import _DropdownSearch, { Props as DropdownSearchProps } from 'siegel-ui/DropdownSearch'
import _Input, { Props as InputProps } from 'siegel-ui/Input'
import _Link, { Props as LinkProps } from 'siegel-ui/Link'
import _NumberPicker, { Props as NumberPickerProps } from 'siegel-ui/NumberPicker'
import _Pagination, { Props as PaginationProps } from 'siegel-ui/Pagination'
import _Popup, { Props as PopupProps } from 'siegel-ui/Popup'
import _Radio, { Props as RadioProps } from 'siegel-ui/Radio'
import _Select, { Props as SelectProps } from 'siegel-ui/Select'
import _Slider, { Props as SliderProps } from 'siegel-ui/Slider'
import _Table, { Props as TableProps } from 'siegel-ui/Table'
import _Tabs, { Props as TabsProps } from 'siegel-ui/Tabs'
import _Toggle, { Props as ToggleProps } from 'siegel-ui/Toggle'
import Swipe, { Props as SwipeProps } from 'siegel-ui/Swipe'
import _Ranger, { Props as RangerProps } from 'siegel-ui/Ranger'
import _Stepper, { Props as StepperProps } from 'siegel-ui/Stepper'


import icons from '../icons'
import { routesConfig } from 'app/Router'

import buttonTheme from './styles/button.sass'
import breadcrumbsTheme from './styles/breadcrumbs.sass'
import calendarTheme from './styles/calendar.sass'
import checkboxTheme from './styles/checkbox.sass'
import _dataTableTheme from './styles/data_table.sass'
import accordionTheme from './styles/accordion.sass'
import _dropdownSearchTheme from './styles/dropdown_search.sass'
import inputTheme from './styles/input.sass'
import linkTheme from './styles/link.sass'
import numberPickerTheme from './styles/number_picker.sass'
import paginationTheme from './styles/pagination.sass'
import popupTheme from './styles/popup.sass'
import radioTheme from './styles/radio.sass'
import _selectTheme from './styles/select.sass'
import sliderTheme from './styles/slider.sass'
import tableTheme from './styles/table.sass'
import tabsTheme from './styles/tabs.sass'
import toggleTheme from './styles/toggle.sass'
import rangerTheme from './styles/ranger.sass'
import stepperTheme from './styles/stepper.sass'



const Button = withDefaults(_Button, {
    className: buttonTheme.button
})

const Breadcrumbs = withDefaults(_Breadcrumbs, {
    theme: breadcrumbsTheme,
    separator: icons.chevron,
    config: routesConfig,
    onChange(newPath) {
        history.push!(newPath)
    }
})

const Calendar = withDefaults(_Calendar, {
    theme: calendarTheme,
    prevMonthIcon: icons.chevron,
    nextMonthIcon: icons.chevron
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
    option__selected: _selectTheme.option__active,
    option__disabled: _selectTheme.option__disabled,
    _disabled: _dropdownSearchTheme._disabled,
    _with_suggestions: _dropdownSearchTheme._with_suggestions,
    _error: _dropdownSearchTheme._error
}
const DropdownSearch = withDefaults(_DropdownSearch, {
    theme: dropdownSearchTheme,
    inputTheme: Object.assign({}, inputTheme, {
        field: `${inputTheme.field} ${_dropdownSearchTheme.field}`,
        children: `${_selectTheme.reset} ${_dropdownSearchTheme.reset}`
    })
})


const Input = withDefaults(_Input, {
    theme: inputTheme
})

const Link = withDefaults(_Link, {
    className: linkTheme.link
})

const NumberPicker = withDefaults(_NumberPicker, {
    theme: numberPickerTheme,
    inputTheme: {
        _focused: numberPickerTheme._focused,
        _disabled: numberPickerTheme._disabled,
        field: `${inputTheme.field} ${numberPickerTheme.field}`,
        label_text: inputTheme.label_text
    },
    minusIcon: icons.chevron,
    plusIcon: icons.chevron
})


const Pagination = withDefaults(_Pagination, {
    theme: paginationTheme,
    iconPrev: icons.chevron,
    iconNext: icons.chevron,
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
    _error: `${inputTheme._error} ${_selectTheme._error}`,
    title_wrapper: `${inputTheme.field} ${_selectTheme.title_wrapper}`,
    error_text: inputTheme.error_text,
    label: inputTheme.label_text
})
const Select = withDefaults(_Select, {
    theme: selectTheme,
    dropdownIcon: icons.chevron
})


const Slider = withDefaults(_Slider, {
    theme: sliderTheme
})

const Table = withDefaults(_Table, {
    className: tableTheme.table
})

const Toggle = withDefaults(_Toggle, {
    theme: toggleTheme
})

const Tabs = withDefaults(_Tabs, {
    theme: tabsTheme
})


const Ranger = withDefaults(_Ranger, {
    theme: rangerTheme,
    rangePickIcon: ''
})

const Stepper = withDefaults(_Stepper, {
    theme: stepperTheme,
    rangerTheme: Object.assign(rangerTheme, {
        root: `${rangerTheme.root} ${stepperTheme.root}`,
        _vertical: `${rangerTheme._vertical} ${stepperTheme._vertical}`,
        _single_picker: stepperTheme.single_pick,
        ranger_content_wrapper: stepperTheme.ranger_content_wrapper,
        children: stepperTheme.ranger_children,
        range__selected: `${rangerTheme.range__selected} ${stepperTheme.range__selected}`
    }),
    rangePickIcon: ''
})



export {
    buttonTheme, Button,
    breadcrumbsTheme, Breadcrumbs,
    calendarTheme, Calendar,
    checkboxTheme, Checkbox,
    dataTableTheme, DataTable,
    Clocks,
    Swipe,
    ErrorBoundary,
    accordionTheme, Accordion,
    dropdownSearchTheme, DropdownSearch,
    inputTheme, Input,
    linkTheme, Link,
    numberPickerTheme, NumberPicker,
    paginationTheme, Pagination,
    popupTheme, Popup,
    radioTheme, Radio,
    selectTheme, Select,
    sliderTheme, Slider,
    tableTheme, Table,
    toggleTheme, Toggle,
    tabsTheme, Tabs,
    rangerTheme, Ranger,
    stepperTheme, Stepper
}
export type {
    ButtonProps, BreadcrumbsProps, CalendarProps, CheckboxProps, ClocksProps, DataTableProps, SwipeProps,
    AccordionProps, DropdownSearchProps, InputProps, LinkProps, NumberPickerProps, PaginationProps,
    PopupProps, RadioProps, SelectProps, SliderProps, TableProps, ToggleProps, TabsProps, RangerProps,
    StepperProps
}