import React, { useState, useMemo } from 'react'
import updateURLQuery from 'siegel-utils/query_update'
import type { Page } from 'siegel-router/types'

import { Link, icons } from 'app/components'
import { GIT_PATHS } from 'app/_constants'
import * as demoComponents from './components'

import styles from './styles.sass'


type SidebarItemProps = {
    key: string
    children: React.ReactNode
    onMouseDown(): void
    className?: string
}

const _demoComponents: Indexable = demoComponents

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
            children: _demoComponents[component].id,
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
                            { ActiveComponent.id }

                            { ActiveComponent.coreSourcesPath && (
                                <Link title={ icons.git }
                                    path={ `${GIT_CORE_UI_PREFIX}/${ActiveComponent.coreSourcesPath}` } />
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