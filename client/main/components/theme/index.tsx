import React from 'react'

import { withDefaults } from 'core-ui/ui_utils'

import ButtonCore from 'core-ui/_form/Button'
import TabsCore from 'core-ui/Tabs'
import buttonTheme from './styles/button.sass'


const Button = withDefaults(ButtonCore, {
    className: buttonTheme.button,
    value: 'default value'
})


// type X = Partial<Parameters<typeof TabsCore>[0]>
// type Y = Parameters<typeof TabsCore>[0]
// const x: X = {

// }
// const y: Y = {

// }
const Tabs = withDefaults(TabsCore, {
    
    activeTab: 2,
    // onChange() {console.log(123)},

    // data: [{
    //     id: 1,
    //     content: 1,
    //     label: '',
    // }]
})
const y = <Tabs   />

// const Tabss = withDefaults<_Tabs>(TabsCore, {
    
// })
// const x = <Tabss  />


export { Button }