import React, { useState, useMemo } from 'react'
import updateURLQuery from 'siegel-ui-utils/query_update'

import { Link, icons } from 'app/components'
import { GIT_PATHS } from 'app/_constants'
import * as demoComponents from './components'

import type { Page } from 'siegel-router/types'

import styles from './styles.sass'


type SidebarItemProps = {
    key: string
    children: React.ReactNode
    onMouseDown(): void
    className?: string
}


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

    const componentsList = []
    for (const component in demoComponents) {
        const props: SidebarItemProps = {
            key: component,
            children: _demoComponents[component]!.coreSrcDirName,
            onMouseDown() {
                updateURLQuery(hashParam, component)
                setActive(component)
            }
        }
        component == active && (props.className = styles.active)

        componentsList.push( <div { ...props } /> )
    }

    const ActiveComponent = _demoComponents[active!]


    return (
        <div className={ styles.page }>
            <div className={ styles.sidebar } children={ componentsList } />

            <div className={ styles.demo_component }>
                { ActiveComponent &&
                    <>
                        <div className={ styles.component_title }>
                            { ActiveComponent.coreSrcDirName }

                            { ActiveComponent.coreSrcDirName[0] != '_' && (
                                <Link title={ icons.git }
                                    path={ `${GIT_CORE_UI_PREFIX}/${ActiveComponent.coreSrcDirName}` } />
                            )}
                        </div>

                        <ActiveComponent />
                    </>
                }
            </div>
        </div>
    )
}


export default DemoPage