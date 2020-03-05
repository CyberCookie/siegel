import React from 'react'
import { withDefaults } from 'core-ui/ui_utils'

import _Button from 'core-ui/Button'
import buttonTheme from './styles/button'


const Button = withDefaults(_Button, {
    className: buttonTheme.button,
    value: 'default value'
})


export { Button }