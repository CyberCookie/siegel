import React from 'react'
import type { Page as PageType } from 'siegel-router/types'


const Nested: PageType = ({ urlParams }) => {
    return (
        <div>
            3 level nested page.<br />
            URL parameter: <b children={ urlParams.param } /><br />

            State:<br />
            <pre children={ JSON.stringify(history?.state, null, 4) } />
        </div>
    )
}


export default Nested