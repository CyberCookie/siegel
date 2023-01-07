import type { Props } from './types'


type ClipboardEvent = React.ClipboardEvent<HTMLInputElement>
type ChangeEvent = React.ChangeEvent<HTMLInputElement>
type MaskCharData = {
    index?: number
    prevFilled?: number
    next?: number
    nextFilled?: number
    isFilled?: boolean
}

type MaskProcessor = NonNullable<Props['mask']>['processor']

type InputTarget = {
    selectionStart: number
    selectionEnd: number
} & HTMLElement & HTMLInputElement


export type { ClipboardEvent, ChangeEvent, MaskCharData, MaskProcessor, InputTarget }