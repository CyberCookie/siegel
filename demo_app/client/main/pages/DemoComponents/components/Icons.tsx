import React from 'react'

import { icons, IconName } from 'app/components'


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


function getIcons() {
    const icons_elements = []
    for (const icon in icons) {
        icons_elements.push(
            <div key={ icon } style={ iconWrapperStyles }>
                { icons[icon as IconName] }
                <div style={ altTextStyles } children={ icon } />
            </div>
        )
    }

    return icons_elements
}

const Demo = () => <>
    <h2 children='icons set' />

    { getIcons() }
</>
Demo.coreSrcDirName = '_icons'


export default Demo