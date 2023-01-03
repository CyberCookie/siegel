import React from 'react'

import type { Props, State } from './types'


const componentID = '-ui-error_boundary'

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { err: null }
    }

    static ID = componentID

    static getDerivedStateFromError(err: Error) {
        console.error(err)
        return { err }
    }

    componentDidCatch() {
        this.props.onError?.(this.state.err!)
    }


    render() {
        const { err } = this.state
        const { children, getUIErrorText } = this.props


        return err
            ?   getUIErrorText?.(err) || `Error has occured: ${err.message}`
            :   children
    }
}


export default ErrorBoundary
export type { Props }