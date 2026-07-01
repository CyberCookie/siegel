import React from 'react'

import type { PageType } from 'siegel-router'


const AnotherNested: PageType = ({ urlParams }) => (
    <div>
        3 level another nested page.<br />
        URL parameter: <b children={ urlParams.param } /><br />

        State:<br />
        <pre children={ JSON.stringify(history?.state, null, 4) } />
    </div>
)


export default AnotherNested