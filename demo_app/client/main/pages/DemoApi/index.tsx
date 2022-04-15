import React, { useState } from 'react'
import fetchModule from 'siegel-store/fetch_module'
import type { Page } from 'siegel-router'

import { Button, Input } from 'app/components'
import { demoApiModule } from 'app/modules'

import styles from './styles.sass'


const DemoApi: Page = () => {
    const { requests, errRes } = fetchModule()[0]
    const [
        { received, counter, proxyRes },
        { api_echo, updateCounter, api_proxyGet }
    ] = demoApiModule.default()

    const [ requestString, setRequestString ] = useState('')

    function sendData() {
        setRequestString('')
        api_echo({ dataToSend: requestString })
    }

    const isDisabledSend = !requestString.length

    const isProxyRequesting = requests[demoApiModule.urls.proxy] > 0
    const isProxyError = errRes[demoApiModule.urls.proxy]


    return (
        <div className={ styles.page }>
            <div className={ styles.api_block }>
                <Input placeholder='type some text and send it...'
                    label='Data to send:'
                    value={ requestString }
                    rootTagAttributes={{
                        onKeyDown(e) {
                            !isDisabledSend && e.key == 'Enter' && sendData()
                        }
                    }}
                    onChange={ value => { setRequestString(value) } } />

                <Button disabled={ isDisabledSend } value='Send!' onClick={ sendData } />

                <h1>Received from server: { received }</h1>
            </div>

            <Button value={ `update global counter [${counter}]` }
                className={ styles.global_counter }
                onClick={ updateCounter } />

            <br />

            <Button value={ isProxyRequesting ? 'Requesting...' : 'proxy fetch' }
                disabled={ isProxyRequesting }
                className={ styles.global_counter }
                onClick={ () => { api_proxyGet(counter.toString()) } } />

            { isProxyError
                ?   <>
                        <br />
                        Error:
                    </>
                :   ''
            }

            <pre children={ JSON.stringify(proxyRes, null, 4) } />
        </div>
    )
}


export default DemoApi