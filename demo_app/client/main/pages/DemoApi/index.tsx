// import { RouteComponentProps } from 'react-router-dom'
import React, { useState } from 'react'
import { Button, Input } from 'app/components'

import testModule from '../../modules/demo_api'

import styles from './styles.sass'


const DemoApi = (/*props: RouteComponentProps*/) => {
    const [
        { received, counter },
        { makeSomeFetch, updateCounter }
    ] = testModule()

    const [ requestString, setRequestString ] = useState(received)


    function sendData() {
        setRequestString('')
        makeSomeFetch(requestString)
    }

    const isDisabledSend = !requestString.length

    return (
        <div className={styles.page}>
            <div className={styles.api_block}>
                <Input placeholder='type some text and send it...'
                    label='Data to send:'
                    value={requestString}
                    attributes={{
                        onKeyDown(e) {
                            !isDisabledSend && e.key == 'Enter' && sendData()
                        }
                    }}
                    onChange={value => { setRequestString(value) }} />
                
                <Button disabled={isDisabledSend} value='Send!' onClick={sendData} />

                <h1>Received from server: { received }</h1>
            </div>


            <Button value={`update global counter [${counter}]`}
                className={styles.global_counter}
                onClick={updateCounter} />
        </div>
    )
}


export default DemoApi