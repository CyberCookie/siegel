import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'


const DEFAULT_STORE_PROP_KEY = 'store'
const DEFAULT_ACTIONS_PROP_KEY = 'actions'


const bindActions = (actions, propKey) => dispatch => ({
    [propKey]: bindActionCreators(actions, dispatch)
})

function bindStateKeys(state, keys, storeName) {
    let result = {}
    for (let i = 0, l = keys[storeName].length; i < l; i++) {
        let prop = keys[storeName][i]
        result[prop] = state[storeName][prop]
    }

    return result
}


const bindState = (keys, propName, singleStoreName) => state => {
    let result = {}
        
    if (singleStoreName) {
        result = bindStateKeys(state, keys, singleStoreName)
    } else {
        for (let storeKey in keys) {
            result[storeKey] = bindStateKeys(state, keys, storeKey)
        }
    }

    return { [propName]: result }
}

function connector({ stateBinding, actionsBinding, areStatePropsEqual, reduxOptions, options = {} }) {
    let _keys, _actions;
    let mergeFunc = options.mergeFunc || null;

    if (areStatePropsEqual && !reduxOptions) {
        reduxOptions = {
            // areOwnPropsEqual: function() { retun true },
            areStatePropsEqual
        }
    }

    if (typeof stateBinding == 'object') {
        let storePropKey = DEFAULT_STORE_PROP_KEY || options.storePropKey;
        let storesToMap = Object.keys(stateBinding)
        let singleStoreName = storesToMap.length == 1 && storesToMap[0]

        _keys = bindState(stateBinding, storePropKey, singleStoreName)
    }

    if (typeof actionsBinding == 'object') {
        let actionsPropKey = DEFAULT_ACTIONS_PROP_KEY || options.actionsPropKey;
        _actions = bindActions(actionsBinding, actionsPropKey)
    }


    return Component => connect(_keys, _actions, mergeFunc, reduxOptions)(Component)
}


export default connector
