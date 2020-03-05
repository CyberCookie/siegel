import request from '../../../services/request'

import { ACTION_IDS, FETCH_ACTION_TYPE } from './cfg'


function dispatchResponse(store, action, resData, error) {
    let { id, beforeDispatch, payload } = action;
    let dispatchObject = {
        _FETCH_ID: resData ? ACTION_IDS.FETCH_END : ACTION_IDS.FETCH_ERROR,
        data: id,
        error
    }

    if (!beforeDispatch || beforeDispatch(resData, error)) {
        Object.assign(dispatchObject, {
            id, payload,
            res: resData
        })
    }

    store.dispatch(dispatchObject)

    error && console.error('Error has occured during the request: ', error)
    // if (error) throw error
}


export default store => next => action => {
    if (action.type != FETCH_ACTION_TYPE) {
        action.type || (action.type = 'REDUX_ACTION')
        return next(action)
    }

    let _dispatchResponse = dispatchResponse.bind(null, store, action)

    store.dispatch({
        _FETCH_ID: ACTION_IDS.FETCH_START,
        data: action.id
    })

    request(action.req)
        .then(_dispatchResponse)
        .catch(error => { _dispatchResponse(null, error) })
}