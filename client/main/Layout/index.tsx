import { hot } from 'react-hot-loader/root'
import React from 'react'

// import { pagePathMap } from 'app/cfg/routes'
// import authorizationModule, { initState as authorizationInitState } from 'app/modules/authorization'

import './styles'


// const isLoginPage = path => path == ('/' + pagePathMap.login)


// const temp = {
//     referrer: '',
//     prevPath: '',
//     isAuthorized: authorizationInitState.isAuthorized
// }

const Layout = ({ children/*, location, history*/ }) => {
    // let [ { isAuthorized }, { validate, logout } ] = authorizationModule();
    // let isCurrentLogin = isLoginPage(location.pathname)
    
    // useLayoutEffect(() => validate(), [])


    // if (temp.prevPath != location.pathname) {
    //     let isPrevLogin = isLoginPage(temp.prevPath)
        
    //     if (temp.prevPath) {
    //         if (isPrevLogin) {
    //             // handle when go to /login then press forward ->
    //             !isCurrentLogin && !isAuthorized && history.goBack()
    //         } else {
    //             temp.referrer = temp.prevPath;

    //             // handle when press back button and go to logout
    //             isCurrentLogin && isAuthorized && logout()
    //         }
    //     } else if (isCurrentLogin) {
    //         temp.referrer = '/'
    //     }


    //     temp.prevPath = location.pathname
    // }


    // if (temp.isAuthorized != isAuthorized) {
    //     if (isAuthorized) {
    //         if (temp.referrer && !temp.isAuthorized) {
    //             setTimeout(() => history.push(temp.referrer))
    //         }
    //     } else if (!isCurrentLogin) {
    //         setTimeout(() => history.push('/login'))
    //     }

    //     temp.isAuthorized = isAuthorized
    // }


    // return isAuthorized !== null && children

    return <main children={children} />
}


export default hot(Layout)