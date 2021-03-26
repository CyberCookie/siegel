//@ts-nocheck

import { ACTION_IDS } from './cfg'


export default {
    clearLastError: () => ({ _FETCH_ID: ACTION_IDS.CLEAR_LAST_ERROR }),

    filterErrors: data => ({
        _FETCH_ID: ACTION_IDS.FILTER_ERRORS,
        data
    }),

    filterSuccess: data => ({
        _FETCH_ID: ACTION_IDS.FILTER_SUCCESS,
        data
    }),

    filterAll: data => ({
        _FETCH_ID: ACTION_IDS.FILTER_ALL,
        data
    })
}