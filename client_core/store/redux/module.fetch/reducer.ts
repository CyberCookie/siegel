//@ts-nocheck

import { ACTION_IDS, initialState } from './cfg'


const filterErrors = (errors, key) => errors.filter(err => err.id !== key)
const filterSuccess = (success, key) => success.filter(suc => suc !== key)

const reducers = {
    [ACTION_IDS.FETCH_START]: (state, action) => ({
        success: state.success,
        requests: [...state.requests, action.data],
        errors: filterErrors(state.errors, action.data)
    }),

    [ACTION_IDS.FETCH_END]: (state, action) => {
        const successResponses = [...state.success]
        const id = action.data;

        successResponses.includes(id) || successResponses.push(id)
            
        return {
            success: successResponses,
            requests: filterSuccess(state.requests, id),
            errors: state.errors,
        }
    },

    [ACTION_IDS.FETCH_ERROR]: (state, action) => {
        const { status, message } = action.error;
        const id = action.data;
        const newError = { status, message, id }

        return {
            requests: filterSuccess(state.requests, id),
            errors: [...state.errors, newError],
            success: filterSuccess(state.success, id)
        }
    },

    [ACTION_IDS.FILTER_ERRORS]: (state, action) => ({
        ...state,
        errors: filterErrors(state.errors, action.data)
    }),

    [ACTION_IDS.FILTER_SUCCESS]: (state, action) => ({
        ...state,
        success: filterSuccess(state.success, action.data)
    }),

    [ACTION_IDS.FILTER_ALL]: (state, action) => ({
        ...state,
        success: action.data ? filterSuccess(state.success, action.data) : [],
        errors: action.data ? filterErrors(state.errors, action.data) : []
    }),

    [ACTION_IDS.CLEAR_LAST_ERROR]: state => {
        state.errors.pop()
        return {
            ...state,
            errors: state.errors
        }
    }
}


export default (state = initialState, action = {}) => (
    reducers[action._FETCH_ID]
        ?   reducers[action._FETCH_ID](state, action)
        :   state
)