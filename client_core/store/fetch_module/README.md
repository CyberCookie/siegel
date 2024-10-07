# Fetch module


Hook store provides `fetch module` which is usefull to track requests status


```ts
import { setup } from 'siegel/lib/client_core/network/request'
import fetchModule from 'siegel/lib/client_core/store/fetch_module'

const { addToReqQueue, removeFromReqQueue, addToErrRes } = fetchModule.store.actions

setup({
    beforeRequest(req) {
        addToReqQueue(req.initialURL) // add request URL to request queue
    },
    afterRequest(req) {
        /*
            success.
            First parameter: URL to remove from request queue
            Second parameter: indicates whether to cleanup errors, matched with this URL, Default: false
        */
        removeFromReqQueue(req.initialURL, true)
    },
    errorHandler(err) {
        addToErrRes(err.res, err.req.initialURL) // error: add error to err response queue
    }
})

```

```ts
import React from 'react'
import fetchModule, { reset } from 'siegel/lib/client_core/store/fetch_module'

const trackURL = '/some_url/path'

const Component = () => {
    const [{ requests, lastError }, { getLastErrorMsgByURL }] = fetchModule()

    return (
        <div>
            { requests[trackURL]
                ?   `request [${trackURL}] is in progress`
                :   'no active requests'
            }

            <div>Error: { getLastErrorMsgByURL(trackURL).message }</div>

            <button onClick={() => reset()}>Reset fetchStore</button>
        </div>
    )
}
```