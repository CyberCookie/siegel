import { hot } from 'react-hot-loader/root'
import React, { useLayoutEffect } from 'react'
import Button_Base from 'core-ui/_form/Button'

import { icons, theme } from 'app/components'
import testModule from 'app/modules/test'

import s from './styles.sass'


const { Button: Button_Themed } = theme; 


const Home = () => {
    let [{ someData }, { makeSomeFetch }] = testModule()

    useLayoutEffect(() => {
        makeSomeFetch({ someBody: 'body' })
    }, [])

    return (
        <div className={s.home_style}>
            honey i'm home!!<br />
            ~~ Styleguide ~~<br />

            <Button_Base value='core button base' />
            <br />

            <Button_Themed />
            <br />

            <Button_Themed value='app button themed modified' />
            <br />

            { icons.Eye_enable }
            { icons.Users }

            <div>
                from server received: { someData.received }
            </div> 
        </div>
    )
}


export default hot(Home)