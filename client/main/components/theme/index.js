import { withDefaults } from 'core-ui/ui_utils'

import _Button from 'core-ui/_form/Button'
import buttonTheme from './styles/button'


const Button = withDefaults(_Button, {
    className: buttonTheme.button,
    value: 'default value'
})


export { Button }