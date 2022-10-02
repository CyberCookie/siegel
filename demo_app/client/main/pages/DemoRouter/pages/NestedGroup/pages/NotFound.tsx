import React from 'react'


const NotFound = () => (
    <div>
        Path specific 404<br />
        State:<br />
        <pre children={ JSON.stringify(history?.state, null, 4) } />
    </div>
)


export default NotFound