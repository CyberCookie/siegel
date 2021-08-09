import React from 'react'

import Link from 'siegel-ui/Link'

import styles from './styles.sass'


const siegelDocsPathPrefix = 'https://github.com/cybercookie/siegel/blob/master/'

const docsListConfig = [
    { path: '', title: 'Siegel' },
    { path: 'demo_app', title: 'Demo app' },
    {
        path: 'client_core',
        title: 'Client core',
        children: [
            { path: 'ui', title: 'Components' },
            { path: 'router', title: 'Router' },
            { path: 'store', title: 'State managers' },
            { path: 'hooks', title: 'Custom hooks' },
            { path: 'services', title: 'Services' }
        ]
    },
    { path: 'src/client_build', title: 'Webpack build' },
    { path: 'src/server', title: 'Server' }
]

const createDocList = (list: typeof docsListConfig, pathPrefix = '') => (
    list.map(({ path, title, children }) => (
        <li key={path}>
            <Link {...{
                path: siegelDocsPathPrefix + pathPrefix + path,
                title
            }} />

            { children && <ul children={createDocList(children, path + '/')} /> }
        </li>
    ))
)

const docsList = createDocList(docsListConfig)


const Home = () => (
    <div className={styles.page}>
        <div className={styles.text_block}>
            <h1 children='Welcome to Siegel demo application!' />

            <div>
                <h2 children='The purpose of this demo app is to demonstrate key features of Siegel' />
                <h2 children='and to provide ready to use scalable app template' />
            </div>

            <ul className={styles.docs_list}>
                Siegel documentation:
                { docsList }
            </ul>
        </div>
    </div>
)


export default Home