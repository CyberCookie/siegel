import React, { useState, useMemo } from 'react'
import buildURLQuery from 'siegel-ui-utils/query_build'
import cx from 'siegel-utils/classname'

import { Link, icons } from 'app/components'
import { GIT_PATHS } from 'app/constants'
import * as demoComponents from './components'

import type { Page } from 'siegel-router/types'

import styles from './styles.sass'


const _demoComponents: Obj<{
    (): React.JSX.Element
    coreSrcDirName: string
}> = demoComponents

const hashParam = 'active'

const GIT_CORE_UI_PREFIX = `${GIT_PATHS.ROOT}${GIT_PATHS.FILES_PREFIX}${GIT_PATHS.CLIENT_CORE.ROOT}/${GIT_PATHS.CLIENT_CORE.UI}`


const DemoPage: Page = () => {
    const [ active, setActive ] = useState(
        useMemo(() => (new URLSearchParams(location.search)).get(hashParam), [])
    )

    const ActiveComponent = _demoComponents[active!]


    return (
        <div className={ styles.page }>
            <div className={ styles.sidebar }>
                { Object.entries(demoComponents)
                    .map(([ demoComponentKey, demoComponent ]) => (
                        <div key={ demoComponentKey } children={ demoComponent.coreSrcDirName }
                            className={ cx('', { [ styles.active ]: demoComponentKey == active }) }
                            onMouseDown={ () => {
                                history.setURLQuery!(
                                    buildURLQuery(hashParam, demoComponentKey)
                                )

                                setActive(demoComponentKey)
                            } } />
                )) }
            </div>

            <div className={ styles.demo_component }>
                { ActiveComponent && <>
                    <div className={ styles.component_title }>
                        { ActiveComponent.coreSrcDirName }

                        { ActiveComponent.coreSrcDirName[0] != '_' &&
                            <Link title={ icons.git }
                                path={ `${GIT_CORE_UI_PREFIX}/${ActiveComponent.coreSrcDirName}` } />
                        }
                    </div>

                    <ActiveComponent />
                </> }
            </div>
        </div>
    )
}


export default DemoPage