// import React from 'react'

import { withDefaults } from 'essence-ui/ui_utils'

import ButtonCore from 'essence-ui/_form/Button'
import buttonTheme from './styles/button.sass'


const Button = withDefaults(ButtonCore, {
    className: buttonTheme.button,
    value: 'default value'
})


export { Button }