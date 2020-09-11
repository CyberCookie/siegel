import { withDefaults } from 'siegel-ui/ui_utils'

import ButtonCore from 'siegel-ui/_form/Button'
import buttonTheme from './styles/button.sass'


const Button = withDefaults(ButtonCore, {
    className: buttonTheme.button,
    value: 'default value'
})


export { Button }