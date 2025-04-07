import React from 'react'

import { icons } from 'app/components'


const iconWrapperStyles: React.CSSProperties = {
    fontSize: '32px',
    display: 'inline-flex',
    margin: '0 0 64px 64px',
    flexDirection: 'column'
}
const altTextStyles: React.CSSProperties = {
    fontSize: '10px',
    paddingTop: '8px'
}


const Demo = () => <>
    <h2 children='icons set' />

    { Object.entries(icons)
        .map(([ iconKey, icon ]) => (
            <div key={ iconKey } style={ iconWrapperStyles }>
                { icon }
                <div style={ altTextStyles } children={ iconKey } />
            </div>
        )) }
</>
Demo.coreSrcDirName = '_icons'


export default Demo