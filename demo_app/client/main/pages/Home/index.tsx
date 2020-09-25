import React from 'react'

import Link from 'siegel-ui/Link'

import styles from './styles.sass'


const siegelDocsPathPrefix = 'https://github.com/cybercookie/siegel/blob/master/'

const docsList = [
    { path: 'README.md', title: 'Siegel' },
    { path: 'src/demo_app/README.md', title: 'Demo app' },
    { path: 'src/ui_core/README.md', title: 'UI core' },
    { path: 'src/ui_build/README.md', title: 'Webpack build' },
    { path: 'src/server/README.md', title: 'Server' },
    { path: 'src/scripts/README.md', title: 'Some usefull scripts' }
].map(({ path, title }) => <li key={siegelDocsPathPrefix + path}><Link {...{ path, title }}/></li>)

const Home = () => (
    <div className={styles.page}>
        <div className={styles.text_block}>
            <h1>Welcome to Siegel demo application!</h1>

            <div>
                <h2>The purpose of this demo app is to demonstrate key features of Siegel</h2>
                <h2>and to provide ready to use scalable app template</h2>
            </div>

            <ul className={styles.docs_list}>
                Siegel documentation:
                { docsList}
            </ul>
        </div>
    </div>
)


export default Home