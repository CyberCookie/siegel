import type { InputRef } from './types'


const setCaretPos = (ref: InputRef, caretPosFrom: number, caretPosTo?: number) => (
    setTimeout(() => {
        ref.current!.setSelectionRange(caretPosFrom, caretPosTo || caretPosFrom)
    })
)

const INPUT_TYPE = {
    INSERT_TEXT: 'insertText',
    INSERT_PASTE: 'insertFromPaste',
    DELETE_BACKWARD: 'deleteContentBackward',
    DELETE_FORWARD: 'deleteContentForward',
    DELETE_CUT: 'deleteByCut'
} as const


export { setCaretPos, INPUT_TYPE }