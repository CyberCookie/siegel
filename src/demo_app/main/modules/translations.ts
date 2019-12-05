import request from 'core/services/request'
import createHookStore from 'core/store/hook_store'


const initState = {
    UIByLang: {},
    currentLang: 'ru',

    _tag: 0
}


const actions = {
    setLang: (state, setState, lang) => {
        state.currentLang = lang;
        setState({ ...state })
    },

    fetchUIDictionary: (state, setState, lang) => {
        request().then(data => {
            state.UIByLang[lang] = data;
            setState({ ...state })
        })
    }
}

const { useStore, store } = createHookStore(initState, actions)

export { store }
export default useStore