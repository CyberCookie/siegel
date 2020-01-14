import { hot } from 'react-hot-loader/root'
import React from 'react'

import { icons } from 'app/components'

import s from './styles.sass'


const Home = () => {
    return (
        <div className={s.home_style}>
            honey i'm home!!<br />
            ~~ Styleguide ~~<br />

            { icons.Eye_enable }
            { icons.Users }
        </div>
    )
}


export default hot(Home)