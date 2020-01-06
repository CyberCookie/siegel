import { applyMiddleware, createStore, combineReducers } from 'redux'


export default (appReducers, options = {}) => {
    let allReducers = typeof appReducers == 'function'
            ?   appReducers
            :   combineReducers(appReducers),

        middlewares = options.middlewares.length
            ?   applyMiddleware(...options.middlewares)
            :   [];

    if (options.RootReducer) {
        let appReducerTemp = allReducers,
            appReducerWrapper = options.RootReducer;

        allReducers = (state, action) => appReducerTemp(
            appReducerWrapper(state, action),
            action
        )
    }
    
    const store = (initialState => createStore(
        allReducers,
        initialState,
        middlewares
    ))({})

    return { store, allReducers }
}