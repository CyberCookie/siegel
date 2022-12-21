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


export type { ClipboardEvent, ChangeEvent, MaskCharData, MaskProcessor }