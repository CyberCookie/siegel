import React from 'react'

import type { PageType } from 'siegel-router'


const Parametrized: PageType = ({ urlParams }) => (
    <div>
        2 level nested parametrized page<br />
        with URL path parameter: <b children={ urlParams.param } />
    </div>
)


export default Parametrized