import React from 'react'

import { GIT_PATHS } from 'app/_constants'
import { Link } from 'app/components'


const Demo = () => (
    <>
        <h2 children='simple link to external source' />

        <Link path={ GIT_PATHS.ROOT } title='Siegel' />
    </>
)
Demo.coreSrcDirName = 'Link'


export default Demo