import type { InputRef } from './types'


const setCaretPos = (ref: InputRef, caretPos: number) => (
    setTimeout(() => {
        ref.current.setSelectionRange(caretPos, caretPos)
    })
)


export { setCaretPos }