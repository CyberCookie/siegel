import React from 'react'

import { GIT_PATHS } from 'app/_constants'
import { Link } from 'app/components'


const { ID } = Link

const Demo = () => {
    return <>
        <h2 children='simple link to external source' />

        <Link path={ GIT_PATHS.ROOT } title='Siegel' />
    </>
}
Demo.id = ID
Demo.coreSourcesPath = 'Link'


export default Demo