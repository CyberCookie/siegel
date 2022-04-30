# Fetch module


Hook store provides `fetch module` which is usefull to track requests status


```js
import { setup } from 'siegel-network/request'
import fetchModule from 'siegel-store/fetch_module'

const { addToReqQueue, removeFromReqQueue, addToErrRes } = fetchModule.store.actions

setup({
    beforeRequest(req) {
        addToReqQueue(req.initialURL) // add request url to request queue
    },
    afterRequest(req) {
        /*
            success.
            First parameter: url to remove from request queue
            Second parameter: indicates whether to cleanup errors, matched with this url, Default: false
        */
        removeFromReqQueue(req.initialURL, true)
    },
    errorHandler(err) {
        addToErrRes(err.res, err.req.initialURL) // error: add error to err response queue
    }
})

```

```js
import React from 'react'
import fetchModule from 'siegel-store/fetch_module'

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
        </div>
    )
}
```