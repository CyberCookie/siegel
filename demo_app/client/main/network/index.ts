import { setupRequests, RequestParams } from 'siegel-network'
import { fetchModule } from 'siegel-store'


const { addToReqQueue, addToErrRes, removeFromReqQueue } = fetchModule.store.actions

const request = setupRequests({
    beforeRequest({ initialURL }) {
        addToReqQueue(initialURL)
    },

    afterRequest({ initialURL }) {
        removeFromReqQueue(initialURL, true)
    },

    errorHandler(err) {
        addToErrRes(err, err.req.initialURL)
    },

    json: true
})


export default request
export type { RequestParams }