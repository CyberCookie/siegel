type State = {
    err: Error | null
}

type Props = {
    /** Component to wrap */
    children: React.ReactNode

    /** Triggers when error occurs */
    onError?(err: Error): void

    /** Constructs UI error message out of occurred one */
    getUIErrorText?(err: Error): React.ReactNode
}


export type { State, Props }