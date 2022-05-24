import React from 'react'
import Link from 'siegel-ui/Link'
import type { Page } from 'siegel-router/types'

import { GIT_PATHS } from 'app/_constants'

import styles from './styles.sass'


const docsListConfig = [
    { path: '', title: 'Siegel' },
    { path: `${GIT_PATHS.FILES_PREFIX}demo_app`, title: 'Demo app' },
    {
        path: GIT_PATHS.FILES_PREFIX + GIT_PATHS.CLIENT_CORE.ROOT,
        title: 'Client core',
        children: [
            { path: GIT_PATHS.CLIENT_CORE.UI, title: 'Components' },
            { path: 'Router', title: 'Router' },
            { path: 'store', title: 'Global store' },
            { path: 'hooks', title: 'Custom hooks' },
            { path: 'network', title: 'Network' },
            { path: 'utils', title: 'Utils' }
        ]
    },
    { path: `${GIT_PATHS.FILES_PREFIX}src/client_build`, title: 'Webpack build' },
    { path: `${GIT_PATHS.FILES_PREFIX}src/server`, title: 'Server' },
    { path: `${GIT_PATHS.FILES_PREFIX}src/utils`, title: 'Utils' }
]

const createDocList = (list: typeof docsListConfig, pathPrefix = '') => (
    list.map(({ path, title, children }) => (
        <li key={ path }>
            <Link { ...{
                path: GIT_PATHS.ROOT + pathPrefix + path,
                title
            } } />

            { children && <ul children={ createDocList(children, path + '/') } /> }
        </li>
    ))
)

const docsList = createDocList(docsListConfig)


const Home: Page = () => (
    <div className={ styles.page }>
        <div className={ styles.text_block }>
            <h1 children='Welcome to Siegel demo application!' />

            <div>
                <h2 children='The purpose of this demo app is to demonstrate key features of Siegel' />
                <h2 children='and to provide ready to use scalable app template' />
            </div>

            <ul className={ styles.docs_list }>
                Docs:
                { docsList }
            </ul>
        </div>
    </div>
)


export default Home