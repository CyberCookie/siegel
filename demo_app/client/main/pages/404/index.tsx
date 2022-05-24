import React from 'react'


const NotFound = () => {
    return (
        <div>
            Global 404<br />
            State:<br />
            <pre children={ JSON.stringify(history?.state, null, 4) } />
        </div>
    )
}


export default NotFound