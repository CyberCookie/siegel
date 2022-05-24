import React from 'react'
import type { Page as PageType } from 'siegel-router/types'


const Parametrized: PageType = ({ urlParams }) => {
    return (
        <div>
            2 level nested parametrized page<br />
            with URL path parameter: <b children={ urlParams.param } />
        </div>
    )
}


export default Parametrized