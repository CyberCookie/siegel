import { useState, useEffect } from 'react'

import isE from '../../../utils/is_exists'
import type { Props } from './types'


type Ref = React.MutableRefObject<HTMLInputElement>
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


const INSERT_TEXT = 'insertText'
const INSERT_PASTE = 'insertFromPaste'
const DELETE_BACKWARD = 'deleteContentBackward'
const DELETE_FORWARD = 'deleteContentForward'

const CODE_UNDO = 'KeyZ'
const CODE_REDO = 'KeyY'

const valuePlaceholderCharDefault = ' '

const setCaretPos = (input: HTMLInputElement, caretPos: number) => setTimeout(() => { input.setSelectionRange(caretPos, caretPos) })

function extractMaskData(mask: Parameters<MaskProcessor>[0], value: Props['value']) {
    const { pattern, patternValueChar, valuePlaceholderChar = valuePlaceholderCharDefault } = mask

    const placeholdersIndexesMap: Indexable<MaskCharData> = {}
    const placeholderCharsOrdered: number[] = []

    let maxLength = 0

    let FIRST_EMPTY_PLACEHOLDER_INDEX: number | undefined
    let LAST_FILLED_INDEX: number | undefined

    let newValue = ''
    for (let i = 0, k = 0, l = pattern.length; i < l; i++) {
        const maskChar = pattern[i]
        const charData: MaskCharData = {}

        isE(LAST_FILLED_INDEX) && (charData.prevFilled = LAST_FILLED_INDEX)

        if (maskChar === patternValueChar) {
            charData.index = maxLength
            maxLength = placeholderCharsOrdered.push(i)

            if (isE(value[k])) {
                charData.isFilled = true
                newValue += value[k]
                k++
                LAST_FILLED_INDEX = i
            } else {
                newValue += valuePlaceholderChar
                isE(FIRST_EMPTY_PLACEHOLDER_INDEX) || (FIRST_EMPTY_PLACEHOLDER_INDEX = i)
            }
        } else newValue += maskChar

        placeholdersIndexesMap[i] = charData
    }

    const FIRST_PLACEHOLDER_INDEX = placeholderCharsOrdered[0]
    const LAST_PLACEHOLDER_INDEX = placeholderCharsOrdered[ maxLength - 1 ]

    let nextFilled, next
    for (let i = LAST_PLACEHOLDER_INDEX; i >= 0; i--) {
        const charData = placeholdersIndexesMap[i]
        isE(next) && (charData.next = next)
        isE(nextFilled) && (charData.nextFilled = nextFilled)

        const { index, isFilled } = charData
        if (isE(index)) {
            next = i
            isFilled && (nextFilled = i)
        }
    }

    return {
        newValue, placeholdersIndexesMap, placeholderCharsOrdered, maxLength,
        FIRST_PLACEHOLDER_INDEX, LAST_PLACEHOLDER_INDEX, FIRST_EMPTY_PLACEHOLDER_INDEX, LAST_FILLED_INDEX
    }
}


const maskProcessor: MaskProcessor = (mask, _inputAttr) => {
    const { valuePlaceholderChar = valuePlaceholderCharDefault, shiftNextChar = true, copyMask, pattern } = mask
    const { value, ref, onChange, onFocus, onCopy, onPaste, onKeyDown } = _inputAttr
    const valueLength = (value as string).length

    const {
        newValue, placeholdersIndexesMap, placeholderCharsOrdered, maxLength,
        FIRST_PLACEHOLDER_INDEX, LAST_PLACEHOLDER_INDEX, FIRST_EMPTY_PLACEHOLDER_INDEX, LAST_FILLED_INDEX
    } = extractMaskData(mask, value as string)

    const maskState = useState({
        caretPos: FIRST_PLACEHOLDER_INDEX,
        lastInputValue: newValue,
        history: ([] as string[]),
        historyPos: -1
    })[0]

    useEffect(() => {
        const timeoutID = setCaretPos((ref as Ref).current, maskState.caretPos)

        return () => {
            if (maskState.historyPos == maskState.history.length - 1) {
                maskState.history.push(value)
                maskState.historyPos++
            }

            clearTimeout(timeoutID)
        }
    }, [ value ])

    _inputAttr.value = maskState.lastInputValue = newValue


    function updateInputData(e: ClipboardEvent | ChangeEvent, newValueArray: string[], newCaretPos: number) {
        if (maskState.historyPos < (maskState.history.length - 1)) {
            maskState.history.length = maskState.historyPos + 1
        }

        maskState.caretPos = newCaretPos

        let newValue = ''
        if (newValueArray.length) {
            for (let i = 0; i < maxLength; i++) {
                const charToAdd = newValueArray[ placeholderCharsOrdered[i] ]
                charToAdd != valuePlaceholderChar && (newValue += charToAdd)
            }
        }

        (e.target as HTMLInputElement).value = newValue
        onChange!(e as ChangeEvent)
    }

    function shiftRight(valueArray: string[], startingFromIndex: number, count = 1) {
        const decrementFromIndex = LAST_FILLED_INDEX == LAST_PLACEHOLDER_INDEX
            ?   maxLength - 2
            :   placeholdersIndexesMap[ LAST_FILLED_INDEX! ].index

        for (let i = decrementFromIndex! + count - 1; i >= startingFromIndex; i--) {
            valueArray[ placeholderCharsOrdered[ i + count ]] = valueArray[ placeholderCharsOrdered[i] ]
        }
    }

    function insert(e: ClipboardEvent | ChangeEvent, startingFrom: number, data: string, updatedValueArray?: string[]) {
        const hasNextChars = isE(LAST_FILLED_INDEX) && startingFrom <= LAST_FILLED_INDEX
        const hasEmpty = isE(FIRST_EMPTY_PLACEHOLDER_INDEX)

        if (hasNextChars || hasEmpty) {
            const valueArray = updatedValueArray || maskState.lastInputValue.split('')
            const dataLength = data.length

            let startingFromIndex = valueLength
            if (hasNextChars) {
                const { index, next } = placeholdersIndexesMap[ startingFrom ]
                startingFromIndex = isE(index) ? index : placeholdersIndexesMap[ next! ].index!

                if (shiftNextChar && (startingFromIndex + dataLength < maxLength)) {
                    shiftRight(valueArray, startingFromIndex, dataLength)
                }
            }

            const freeSpace = maxLength - startingFromIndex
            const insertLength = dataLength > freeSpace ? freeSpace : dataLength

            for (let k = 0, i = startingFromIndex; k < insertLength; k++, i++) {
                valueArray[ placeholderCharsOrdered[ i ]] = data[k]
            }


            const newLastFilledIndex = placeholderCharsOrdered[ insertLength + startingFromIndex - 1 ]
            const { next } = placeholdersIndexesMap[ newLastFilledIndex ]
            const newCaretPos = isE(next) ? next : newLastFilledIndex + 1


            updateInputData(e, valueArray, newCaretPos)
        } else setCaretPos((ref as Ref).current, LAST_FILLED_INDEX! + 1)
    }

    function replace(e: ChangeEvent | ClipboardEvent, startingFrom: number, count: number, data = '') {
        let startingFromIndex
        const { isFilled, index, next } = placeholdersIndexesMap[startingFrom]

        if (isFilled) startingFromIndex = index
        else if (isE(next)) startingFromIndex = placeholdersIndexesMap[next].index


        if (isE(startingFromIndex)) {
            const valueArray = maskState.lastInputValue.split('')
            const selectRangeEnd = startingFrom + count
            const insertDataLength = data.length

            let nextCaretPos = startingFrom < FIRST_PLACEHOLDER_INDEX ? FIRST_PLACEHOLDER_INDEX : startingFrom
            let insertedCharsCount = 0


            for (let i = startingFromIndex; i < maxLength; i++) {
                const valueIndex = placeholderCharsOrdered[i]

                if (valueIndex < selectRangeEnd) {
                    const dataChar = data[insertedCharsCount]
                    valueArray[valueIndex] = dataChar || valuePlaceholderChar

                    if (dataChar) {
                        insertedCharsCount++
                        nextCaretPos = placeholdersIndexesMap[valueIndex].next || (valueIndex + 1)
                    }
                } else break
            }

            shiftNextChar && insertedCharsCount < insertDataLength && !placeholdersIndexesMap[ LAST_PLACEHOLDER_INDEX ].isFilled
                ?   insert(e, nextCaretPos, data.substr(insertedCharsCount), valueArray)
                :   updateInputData(e, valueArray, nextCaretPos)
        } else setCaretPos((ref as Ref).current, FIRST_PLACEHOLDER_INDEX)
    }


    copyMask || (_inputAttr.onCopy = e => {
        const { selectionStart, selectionEnd } = (e.target as HTMLTextAreaElement)
        const { isFilled, nextFilled } = placeholdersIndexesMap[selectionStart]

        const valueArray = maskState.lastInputValue.split('')

        let valueToCopy = isFilled ? valueArray[selectionStart] : ''
        for (let i = nextFilled!; i < selectionEnd && isE(i); i = placeholdersIndexesMap[i].nextFilled!) {
            valueToCopy += valueArray[i]
        }
        valueToCopy && window.navigator.clipboard.writeText(valueToCopy)

        onCopy && onCopy(e)
    })


    if (onChange) {
        _inputAttr.onPaste = e => {
            const { selectionStart, selectionEnd } = (e.target as HTMLTextAreaElement)
            const dataToPaste = e.clipboardData.getData('text')
            const selectionRange = selectionStart - selectionEnd

            selectionRange
                ?   replace(e, selectionStart, Math.abs(selectionRange), dataToPaste)
                :   insert(e, selectionStart, dataToPaste)

            onPaste && onPaste(e)
        }

        _inputAttr.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputType = (e.nativeEvent as InputEvent).inputType
            if (inputType == INSERT_PASTE) return

            const { selectionStart, value: inputValue } = (e.target as typeof e.target & { selectionStart: number })

            const inputLength = inputValue.length
            if (!inputLength) return updateInputData(e, [], FIRST_PLACEHOLDER_INDEX)

            let removedChars = pattern.length - inputLength
            let nextCaretPos


            if (inputType == INSERT_TEXT) {
                const prevCaretPos = selectionStart - 1
                const data = (e.nativeEvent as InputEvent).data!

                ++removedChars
                    ?   replace(e, prevCaretPos, removedChars, data)
                    :   insert(e, prevCaretPos, data)
            } else {
                const isBackspace = inputType == DELETE_BACKWARD
                if ((isBackspace || inputType == DELETE_FORWARD) && valueLength) {
                    if (removedChars > 1) replace(e, selectionStart, removedChars)
                    else {
                        const newValueArray = maskState.lastInputValue.split('')

                        if (isBackspace) {
                            if (selectionStart < FIRST_PLACEHOLDER_INDEX) return setCaretPos((ref as Ref).current, FIRST_PLACEHOLDER_INDEX)
                            else {
                                const { prevFilled, isFilled } = placeholdersIndexesMap[selectionStart]

                                let indexToReplace, newPrevFilled
                                if (isFilled) {
                                    indexToReplace = selectionStart
                                    newPrevFilled = prevFilled
                                } else {
                                    indexToReplace = prevFilled
                                    newPrevFilled = placeholdersIndexesMap[prevFilled!].prevFilled
                                }

                                newValueArray[indexToReplace!] = valuePlaceholderChar
                                nextCaretPos = isE(newPrevFilled) ? newPrevFilled + 1 : FIRST_PLACEHOLDER_INDEX
                            }
                        } else {
                            if (selectionStart > LAST_FILLED_INDEX!) return setCaretPos((ref as Ref).current, LAST_PLACEHOLDER_INDEX + 1)
                            else {
                                const { nextFilled, isFilled } = placeholdersIndexesMap[selectionStart]

                                const indexToReplace = isFilled ? selectionStart : nextFilled
                                isE(indexToReplace) && (newValueArray[indexToReplace] = valuePlaceholderChar)

                                nextCaretPos = selectionStart < FIRST_PLACEHOLDER_INDEX ? FIRST_PLACEHOLDER_INDEX : selectionStart
                            }
                        }

                        updateInputData(e, newValueArray, nextCaretPos)
                    }
                } else setCaretPos((ref as Ref).current, FIRST_PLACEHOLDER_INDEX)
            }
        }

        _inputAttr.onFocus = e => {
            const nextCaretPos = isE(FIRST_EMPTY_PLACEHOLDER_INDEX)
                ?   FIRST_EMPTY_PLACEHOLDER_INDEX
                :   LAST_FILLED_INDEX! + 1

            maskState.caretPos = nextCaretPos

            setCaretPos((ref as Ref).current, nextCaretPos)
            onFocus && onFocus(e)
        }

        _inputAttr.onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            const { code } = e.nativeEvent
            const { history, historyPos } = maskState

            let newValue: string | undefined
            if (code == CODE_UNDO) {
                if (historyPos > -1) {
                    ((historyPos + 1) == history.length) && history.push(value)

                    newValue = history[ historyPos ]
                    maskState.historyPos--
                }
            } else if (code == CODE_REDO && historyPos < history.length - 2) {
                newValue = history[ historyPos + 2 ]
                maskState.historyPos++
            }

            if (isE(newValue)) {
                (e.target as HTMLInputElement).value = newValue

                const newValLength = newValue.length
                maskState.caretPos = newValLength
                    ?   newValLength == maxLength
                        ?   LAST_PLACEHOLDER_INDEX + 1
                        :   placeholderCharsOrdered[ newValLength - 1 ] + 1
                    :   FIRST_PLACEHOLDER_INDEX

                onChange(e)
            }

            onKeyDown && onKeyDown(e)
        }
    }
}


export default maskProcessor