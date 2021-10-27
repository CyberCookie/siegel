import createApi, { RequestParams } from 'siegel-services/request'
import { store as fetchModuleStore } from 'siegel-store/hook_store/fetch_module'


const { addToReqQueue, addToErrRes, removeFromReqQueue } = fetchModuleStore.actions

const request = createApi({
    beforeRequest({ url }) { addToReqQueue(url) },
    afterRequest({ initialURL }) { removeFromReqQueue(initialURL, true) },
    errorHandler(err) { addToErrRes(err, err.req.initialURL) },

    json: true
})


export default request
export type { RequestParams }