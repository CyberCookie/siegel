export default _modules => {
    const isSingleModule = !Array.isArray(_modules) || _modules.length == 1;
    let stateBinding, actionsBinding, areStatePropsEqual;
    
    
    if (isSingleModule) {
        stateBinding = { [_modules.STORE_KEY]: Object.keys(_modules.initState) }
        actionsBinding = _modules.actions;

        areStatePropsEqual = ({ store: pStore }, { store: nStore }) => (
            pStore._lastUpdated == nStore._lastUpdated
        )
    } else {
        stateBinding = {}
        actionsBinding = {}

        const stateMapper = ({ STORE_KEY, initState, actions }) => {
            stateBinding[STORE_KEY] = Object.keys(initState)
            actionsBinding = Object.assign(actionsBinding, actions)
        }
        _modules.forEach(stateMapper)

        areStatePropsEqual = ({ store: pStore }, { store: nStore }) => {
            const checkForUpdates = ({ STORE_KEY }) => (
                pStore[STORE_KEY]._lastUpdated != nStore[STORE_KEY]._lastUpdated
            )

            return !_modules.some(checkForUpdates)
        }
    }

    return { stateBinding, actionsBinding, areStatePropsEqual }
}