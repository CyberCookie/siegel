import React    from 'react'
import { hot } from 'react-hot-loader/root'

import Button from 'core-ui/Button'
import buttonTheme from 'core-ui/Button/theme_sc.sass'

// import Tabs from 'core-ui/Tabs'

import s from './styles.sass'


const Home = () => {
    return (
        <div className={s.home_style}>
            honey i'm home!!<br />
            ~~ Styleguide ~~<br />

            <p>default</p>
            <Button value='Hello' className={buttonTheme['-ui-button']} />

            <p>bordered</p>
            <Button value='Hello' className={buttonTheme['-ui-button'] + ' ' + buttonTheme['-ui-button__bordered']} />

            {/* <Tabs onTabClick={() } /> */}
        </div>
    )
}


export default hot(Home)