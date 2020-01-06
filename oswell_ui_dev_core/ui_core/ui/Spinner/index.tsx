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

const Spinner = props => {
    let { watchActions, requests, children, visible, conditions, className = '' } = props;

    const findFailureCondition = condition => !condition;
    const findProcessing = request => requests.includes(request);

    let isNoRender = watchActions.some(findProcessing) || conditions.some(findFailureCondition);


    return isNoRender
        ?   <div className={`${className} -ui-spinner`}>
                <div className='spinner' children={spinner} />

                { visible && children }
            </div>
            
        :   children || null
}


export default Spinner