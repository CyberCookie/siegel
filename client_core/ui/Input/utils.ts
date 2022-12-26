import type { InputRef } from './types'


const setCaretPos = (ref: InputRef, caretPos: number) => (
    setTimeout(() => {
        ref.current.setSelectionRange(caretPos, caretPos)
    })
)

const INPUT_TYPE = {
    INSERT_TEXT: 'insertText',
    INSERT_PASTE: 'insertFromPaste',
    DELETE_BACKWARD: 'deleteContentBackward',
    DELETE_FORWARD: 'deleteContentForward',
    DELETE_CUT: 'deleteByCut'
}


export { setCaretPos, INPUT_TYPE }