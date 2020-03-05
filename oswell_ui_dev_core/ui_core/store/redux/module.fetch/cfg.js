const FETCH_ACTION_TYPE = 'FETCH'

const initialState = {
    requests: [],
    errors: [],
    success: []
}

const ACTION_IDS = {
    FETCH_START: 'FETCH_START',
    FETCH_END: 'FETCH_END',
    FETCH_ERROR: 'FETCH_ERROR',
    CLEAR_LAST_ERROR: 'CLEAR_LAST_ERROR',
    FILTER_ERRORS: 'FILTER_ERRORS',
    FILTER_SUCCESS: 'FILTER_SUCCESS',
    FILTER_ALL: 'FILTER_ALL'
}


export { FETCH_ACTION_TYPE, ACTION_IDS, initialState }