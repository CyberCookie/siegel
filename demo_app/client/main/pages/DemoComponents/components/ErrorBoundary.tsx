import React, { useState } from 'react'

import { ErrorBoundary } from 'app/components'


const { ID } = ErrorBoundary

const ComponentWithError = () => {
    throw Error('component error')
    return <></>
}

const Demo = () => {
    const [ isShowErrorComponent, setErrorComponentVisibility ] = useState(false)

    return <>
        <h2 onMouseDown={ () => { setErrorComponentVisibility(true) } }>
            click to render buggy component wrapped in ErrorBoundary
        </h2>

        <h3>
            Error is not handling in dev mode. You should press <b>close</b> on error screen to observe the result
        </h3>

        { isShowErrorComponent && (
            <ErrorBoundary>
                <ComponentWithError />
            </ErrorBoundary>
        )}
    </>
}
Demo.id = ID
Demo.coreSourcesPath = 'ErrorBoundary'


export default Demo