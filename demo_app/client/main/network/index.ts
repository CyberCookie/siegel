import createApi, { RequestParams } from 'siegel-network/request'
import { store as fetchModuleStore } from 'siegel-store/fetch_module'


const { addToReqQueue, addToErrRes, removeFromReqQueue } = fetchModuleStore.actions

const request = createApi({
    beforeRequest({ url, options }) {
        addToReqQueue(url)
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