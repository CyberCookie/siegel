//TODO?: process with mask applied


import { useState, useEffect } from 'react'

import isExists from '../../../common/is/exists'
import * as keyCodes from '../_internals/key_codes'
import { setCaretPos, INPUT_TYPE } from './utils'

import type { InputRef } from './types'
import type {
    ClipboardEvent, ChangeEvent, MaskCharData, MaskProcessor, InputTarget
} from './mask_processor_types'


const {
    DELETE_BACKWARD, DELETE_CUT, DELETE_FORWARD, INSERT_PASTE, INSERT_TEXT
} = INPUT_TYPE

const valuePlaceholderCharDefault = ' '


function extractMaskData(
    mask: Parameters<MaskProcessor>[0],
    value: Parameters<MaskProcessor>[1]['value']
) {

    const {
        pattern, patternValueChar, formatterMode,
        valuePlaceholderChar = valuePlaceholderCharDefault
    } = mask

    const patternLength = pattern.length

    const placeholdersIndexesMap: Record<string, MaskCharData> = {}
    const placeholderCharsOrdered: number[] = []

    let maxLength = 0

    let FIRST_EMPTY_PLACEHOLDER_INDEX: number | undefined
    let LAST_FILLED_INDEX: number | undefined

    let newValue = ''
    for (let i = 0, k = 0; i < patternLength; i++) {
        const maskChar = pattern[i]
        const charData: MaskCharData = {}

        isExists(LAST_FILLED_INDEX) && (charData.prevFilled = LAST_FILLED_INDEX)


        if (maskChar == patternValueChar) {
            charData.index = maxLength
            maxLength = placeholderCharsOrdered.push(i)

            if (isExists(value[k])) {
                charData.isFilled = true
                newValue += value[k]
                k++
                LAST_FILLED_INDEX = i

            } else {
                formatterMode || (newValue += valuePlaceholderChar)
                isExists(FIRST_EMPTY_PLACEHOLDER_INDEX) || (FIRST_EMPTY_PLACEHOLDER_INDEX = i)
            }

        } else if (!formatterMode || !isExists(FIRST_EMPTY_PLACEHOLDER_INDEX)) {
            newValue += maskChar
        }

        placeholdersIndexesMap[i] = charData
    }


    const FIRST_PLACEHOLDER_INDEX = placeholderCharsOrdered[0]
    const LAST_PLACEHOLDER_INDEX = placeholderCharsOrdered.at(-1)!

    let nextFilled, next
    for (let i = LAST_PLACEHOLDER_INDEX; i >= 0; i--) {
        const charData = placeholdersIndexesMap[i]
        isExists(next) && (charData.next = next)
        isExists(nextFilled) && (charData.nextFilled = nextFilled)

        const { index, isFilled } = charData
        if (isExists(index)) {
            next = i
            isFilled && (nextFilled = i)
        }
    }

    const lastCharData = placeholdersIndexesMap[patternLength - 1]
    placeholdersIndexesMap[patternLength] = {
        prevFilled: lastCharData.isFilled
            ?   patternLength - 1
            :   lastCharData.prevFilled
    }


    return {
        newValue, placeholdersIndexesMap, placeholderCharsOrdered, maxLength,
        FIRST_PLACEHOLDER_INDEX, LAST_PLACEHOLDER_INDEX, FIRST_EMPTY_PLACEHOLDER_INDEX, LAST_FILLED_INDEX
    }
}


const maskProcessor: MaskProcessor = (mask, _inputAttr) => {
    const {
        copyMask, formatterMode,
        valuePlaceholderChar = valuePlaceholderCharDefault,
        shiftNextChar = true
    } = mask
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
        const timeoutID = setCaretPos(ref as InputRef, maskState.caretPos)

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
                if (formatterMode && !isExists(charToAdd)) break
                else if (charToAdd != valuePlaceholderChar) newValue += charToAdd
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
        const hasNextChars = isExists(LAST_FILLED_INDEX) && startingFrom <= LAST_FILLED_INDEX
        const hasEmpty = isExists(FIRST_EMPTY_PLACEHOLDER_INDEX)

        if (hasNextChars || hasEmpty) {
            const valueArray = updatedValueArray || maskState.lastInputValue.split('')
            const dataLength = data.length

            let startingFromIndex = valueLength
            if (hasNextChars) {
                const { index, next } = placeholdersIndexesMap[ startingFrom ]
                startingFromIndex = isExists(index) ? index : placeholdersIndexesMap[ next! ].index!

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
            const newCaretPos = isExists(next) ? next : newLastFilledIndex + 1

            updateInputData(e, valueArray, newCaretPos)

        } else setCaretPos(ref as InputRef, LAST_FILLED_INDEX! + 1)
    }

    function replace(e: ChangeEvent | ClipboardEvent, startingFrom: number, count: number, data = '') {
        let startingFromIndex
        const { isFilled, index, next } = placeholdersIndexesMap[startingFrom]

        if (isFilled) startingFromIndex = index
        else if (isExists(next)) startingFromIndex = placeholdersIndexesMap[next].index


        if (isExists(startingFromIndex)) {
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
                ?   insert(e, nextCaretPos, data.substring(insertedCharsCount), valueArray)
                :   updateInputData(e, valueArray, nextCaretPos)

        } else setCaretPos(ref as InputRef, FIRST_PLACEHOLDER_INDEX)
    }


    copyMask || (_inputAttr.onCopy = _inputAttr.onCut = e => {
        const { selectionStart, selectionEnd } = (e.target as HTMLTextAreaElement)
        const { isFilled, nextFilled } = placeholdersIndexesMap[selectionStart]

        const valueArray = maskState.lastInputValue.split('')

        let valueToCopy = isFilled ? valueArray[selectionStart] : ''
        for (let i = nextFilled!; i < selectionEnd && isExists(i); i = placeholdersIndexesMap[i].nextFilled!) {
            valueToCopy += valueArray[i]
        }
        valueToCopy && navigator.clipboard.writeText(valueToCopy)

        onCopy?.(e)
    })


    if (onChange) {
        _inputAttr.onPaste = e => {
            const { selectionStart, selectionEnd } = (e.target as HTMLTextAreaElement)
            const dataToPaste = e.clipboardData.getData('text')
            const selectionRange = selectionStart - selectionEnd

            selectionRange
                ?   replace(e, selectionStart, Math.abs(selectionRange), dataToPaste)
                :   insert(e, selectionStart, dataToPaste)

            onPaste?.(e)
        }

        _inputAttr.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { inputType } = e.nativeEvent as InputEvent
            if (inputType == INSERT_PASTE) return

            const { selectionStart, value: inputValue } = (e.target as InputTarget)

            const inputLength = inputValue.length
            if (!inputLength) return updateInputData(e, [], FIRST_PLACEHOLDER_INDEX)


            let removedChars = newValue.length - inputLength
            let nextCaretPos

            if (inputType == INSERT_TEXT) {
                const prevCaretPos = selectionStart - 1
                const { data } = e.nativeEvent as InputEvent

                ++removedChars
                    ?   replace(e, prevCaretPos, removedChars, data!)
                    :   insert(e, prevCaretPos, data!)

            } else {
                const isBackwardDelete = inputType == DELETE_BACKWARD || inputType == DELETE_CUT

                if ((isBackwardDelete || inputType == DELETE_FORWARD) && valueLength) {
                    if (removedChars > 1) replace(e, selectionStart, removedChars)

                    else {
                        const newValueArray = maskState.lastInputValue.split('')

                        if (isBackwardDelete) {
                            if (selectionStart < FIRST_PLACEHOLDER_INDEX) {
                                return setCaretPos(ref as InputRef, FIRST_PLACEHOLDER_INDEX)

                            } else {
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
                                nextCaretPos = isExists(newPrevFilled) ? newPrevFilled + 1 : FIRST_PLACEHOLDER_INDEX
                            }

                        } else {
                            if (selectionStart > LAST_FILLED_INDEX!) {
                                return setCaretPos(ref as InputRef, LAST_PLACEHOLDER_INDEX + 1)

                            } else {
                                const { nextFilled, isFilled } = placeholdersIndexesMap[selectionStart]

                                const indexToReplace = isFilled ? selectionStart : nextFilled
                                isExists(indexToReplace) && (newValueArray[indexToReplace] = valuePlaceholderChar)

                                nextCaretPos = selectionStart < FIRST_PLACEHOLDER_INDEX ? FIRST_PLACEHOLDER_INDEX : selectionStart
                            }
                        }

                        updateInputData(e, newValueArray, nextCaretPos)
                    }

                } else setCaretPos(ref as InputRef, FIRST_PLACEHOLDER_INDEX)
            }
        }

        _inputAttr.onFocus = e => {
            if (!isExists(LAST_FILLED_INDEX)) {
                const nextCaretPos = FIRST_EMPTY_PLACEHOLDER_INDEX!
                maskState.caretPos = nextCaretPos

                setCaretPos(ref as InputRef, nextCaretPos)
            }

            onFocus?.(e)
        }

        _inputAttr.onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            const { code, shiftKey } = e.nativeEvent
            const { history, historyPos } = maskState

            let newValue: string | undefined
            if (code == keyCodes.UNDO) {
                if (historyPos > -1) {
                    ((historyPos + 1) == history.length) && history.push(value)

                    newValue = history[ historyPos ]
                    maskState.historyPos--
                }

            } else if (code == keyCodes.REDO) {
                if (historyPos < history.length - 2) {
                    newValue = history[ historyPos + 2 ]
                    maskState.historyPos++
                }

            } else {
                const isLeft = code == keyCodes.LEFT
                const isRight = code == keyCodes.RIGHT
                const isUp = code == keyCodes.UP
                const isDown = code == keyCodes.DOWN

                if (isDown || isUp || isLeft || isRight) {
                    e.preventDefault()
                    const { selectionStart, selectionEnd } = e.target as InputTarget


                    if (isUp || isDown) {
                        const newCaretPos = isUp
                            ?   FIRST_PLACEHOLDER_INDEX
                            :   LAST_FILLED_INDEX! + 1 || FIRST_PLACEHOLDER_INDEX

                        maskState.caretPos = newCaretPos
                        setCaretPos(ref as InputRef, newCaretPos)

                    } else {
                        let caretPosFrom: number | undefined
                        let caretPosTo: number | undefined
                        let caretPos: number | undefined

                        if (!isExists(LAST_FILLED_INDEX)) caretPosFrom = FIRST_PLACEHOLDER_INDEX

                        else if (!shiftKey && (selectionEnd - selectionStart)) {
                            const newCaretPos = isLeft ? selectionStart : selectionEnd
                            maskState.caretPos = newCaretPos
                            setCaretPos(ref as InputRef, newCaretPos)

                        } else {
                            if (isLeft) {
                                const { prevFilled } = placeholdersIndexesMap[ selectionStart ]
                                caretPosFrom = caretPos = prevFilled!

                                if (shiftKey) {
                                    if (maskState.caretPos > selectionStart) {
                                        let prevFromSelectionEnd = placeholdersIndexesMap[ selectionEnd ].prevFilled
                                        if ((selectionEnd - prevFromSelectionEnd!) == 1) {
                                            prevFromSelectionEnd = placeholdersIndexesMap[ prevFromSelectionEnd! ].prevFilled! + 1
                                        }

                                        caretPosFrom = selectionStart
                                        caretPosTo = caretPos = prevFromSelectionEnd

                                    } else {
                                        caretPosTo = selectionStart == selectionEnd
                                            ?   caretPosFrom! + 1
                                            :   selectionEnd

                                        caretPos = caretPosFrom
                                    }

                                } else if ((selectionStart - prevFilled!) > 1) {
                                    caretPosFrom++
                                    caretPos = caretPosFrom
                                }

                            } else {
                                const { nextFilled, isFilled } = placeholdersIndexesMap[ selectionStart! ]
                                caretPosFrom = isFilled ? selectionStart! : nextFilled

                                if (!isExists(caretPosFrom)) return

                                if (shiftKey) {
                                    if (selectionStart == selectionEnd) {
                                        caretPosTo = caretPosFrom! + 1

                                    } else if (maskState.caretPos < selectionEnd) {
                                        const nextFromSelectionStart = placeholdersIndexesMap[ selectionStart ].nextFilled
                                        caretPosFrom = caretPos = isExists(nextFromSelectionStart)
                                            ?   nextFromSelectionStart
                                            :   selectionEnd

                                        caretPosTo = selectionEnd

                                    } else {
                                        const { isFilled, nextFilled } = placeholdersIndexesMap[ selectionEnd! ]
                                        caretPosTo = ((isFilled ? selectionEnd : nextFilled)! + 1) || selectionEnd!
                                    }

                                } else if (isFilled) caretPosFrom!++

                                if (!isExists(caretPos)) {
                                    caretPos = isExists(caretPosTo) ? caretPosTo : caretPosFrom
                                }
                            }
                        }


                        if (isExists(caretPos)) {
                            maskState.caretPos = caretPos
                            setCaretPos(ref as InputRef, caretPosFrom!, caretPosTo)
                        }
                    }
                }
            }


            if (isExists(newValue)) {
                (e.target as HTMLInputElement).value = newValue

                const newValLength = newValue.length
                maskState.caretPos = newValLength
                    ?   newValLength == maxLength
                        ?   LAST_PLACEHOLDER_INDEX + 1
                        :   placeholderCharsOrdered[ newValLength - 1 ] + 1
                    :   FIRST_PLACEHOLDER_INDEX

                onChange(e)
            }

            onKeyDown?.(e)
        }
    }
}


export default maskProcessor