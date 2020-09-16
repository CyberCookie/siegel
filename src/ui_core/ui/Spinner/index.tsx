import React from 'react'

import './styles'


const spinner = (
    <svg>
        <defs>
            <linearGradient id='loader-gradient'>
                <stop offset='0%' stopColor='#2FEBDF'/>
                <stop offset='100%' stopColor='#17A8FF'/>
            </linearGradient>
        </defs>

        <circle strokeLinecap='round' className='spin' stroke='url(#loader-gradient)' />
    </svg>
)

const componentID = '-ui-spinner'

const Spinner = (props: any) => {
    const { className = '' } = props;


    return <div className={`${className} ${componentID}`} children={spinner} />
}


export default Spinner