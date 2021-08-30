import React, { useState } from 'react'
import type { Page } from 'siegel-router'

import { Button, Input } from 'app/components'
import testModule from 'app/modules/demo_api'

import styles from './styles.sass'


const DemoApi: Page = () => {
    const [
        { received, counter, proxyRes },
        { makeSomeFetch, updateCounter, proxyGet }
    ] = testModule()

    const [ requestString, setRequestString ] = useState('')


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

            <br />

            <Button value='proxy fetch'
                className={styles.global_counter}
                onClick={() => { proxyGet(counter.toString()) }} />

            <pre children={JSON.stringify(proxyRes, null, 4)} />
        </div>
    )
}


export default DemoApi