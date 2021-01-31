import { useState, useEffect } from 'react'

import isE from '../../../utils/is_exists'

import type { Props } from './types'


type Ref = React.MutableRefObject<HTMLInputElement>
type ClipboardEvent = React.ClipboardEvent<HTMLInputElement>
type ChangeEvent = React.ChangeEvent<HTMLInputElement>


const setCaretPos = (input: HTMLInputElement, caretPos: number) => setTimeout(() => { input.setSelectionRange(caretPos, caretPos) })

const maskProcessor: Props['mask']['processor'] = (mask, _inputAttr) => {
    const { patternValueChar, valuePlaceholderChar = ' ', shiftNextValue = true, copyMask, pattern } = mask;
    const { value, ref, onChange, onFocus } = _inputAttr;
    
    const valueLength = value.length;

    const maskChars = new Set()
    const placeholdersIndexesMap: Indexable<number> = {}
    const placeholderCharsOrdered: number[] = []

    let FIRST_EMPTY_PLACEHOLDER_INDEX: number;
    let FIRST_FILLED_INDEX: number;
    let LAST_FILLED_INDEX: number;
    
    
    let newValue = ''
    for (let i = 0, k = 0, l = pattern.length; i < l; i++) {
        const maskChar = pattern[i]

        if (maskChar === patternValueChar) {
            placeholderCharsOrdered.push(i)
            placeholdersIndexesMap[i] = placeholderCharsOrdered.length - 1
            
            if (isE(value[k])) {
                newValue += value[k]
                k++

                isE(FIRST_FILLED_INDEX) || (FIRST_FILLED_INDEX = i)
                LAST_FILLED_INDEX = i
            } else {
                newValue += valuePlaceholderChar;
                isE(FIRST_EMPTY_PLACEHOLDER_INDEX) || (FIRST_EMPTY_PLACEHOLDER_INDEX = i)
            }
        } else {
            newValue += maskChar;
            maskChars.add(i)
        }
    }
    _inputAttr.value = newValue;
    
    
    const FIRST_PLACEHOLDER_INDEX = placeholderCharsOrdered[0]
    const LAST_PLACEHOLDER_INDEX = placeholderCharsOrdered[ placeholderCharsOrdered.length - 1 ]
    const LAST_EMPTY_PLACEHOLDER_INDEX = placeholderCharsOrdered[ valueLength ]


    function updateInputData(e: ClipboardEvent | ChangeEvent, newValueArray: string[], newCaretPos?: number) {
        maskStore.caretPos = isE(newCaretPos)
            ?   newCaretPos
            :   valueLength
                ?   (LAST_PLACEHOLDER_INDEX + 1)
                :   FIRST_PLACEHOLDER_INDEX;

        (e.target as HTMLInputElement).value = newValueArray.length
            ?   placeholderCharsOrdered.reduce((acc, placeholderValueIndex) => {
                    const finalCharToAdd = newValueArray[placeholderValueIndex]

                    return finalCharToAdd != valuePlaceholderChar
                        ?   acc + finalCharToAdd
                        :   acc
                }, '')
            :   ''
        
        onChange(e as ChangeEvent)
    }
    

    copyMask || (_inputAttr.onCopy = (e: ClipboardEvent) => {
        const { selectionStart, selectionEnd } = (e.target as HTMLInputElement)
        const valueArray = maskStore.lastInputValue.split('')
        let valueToCopy = ''

        for (let i = selectionStart; i <= selectionEnd; i++) {
            const charOrder = placeholdersIndexesMap[i]
            isE(charOrder) && (valueToCopy += valueArray[i])
        }

        window.navigator.clipboard.writeText(valueToCopy)
    })

    _inputAttr.onPaste = (e: ClipboardEvent) => {
        const { selectionStart: prevCaretPos, selectionEnd } = (e.target as HTMLInputElement)
        
        if (selectionEnd - prevCaretPos > 0) {
            //TODO
            return console.log('YET NOT IMPLEMENTED')
        }
        
        const maxLength = placeholderCharsOrdered.length;
        const newValueArray = maskStore.lastInputValue.split('')

        const pasteData = e.clipboardData.getData('text').split('')
        let pasteLength = pasteData.length;


        function pasteAll(freeSpace = maxLength - valueLength, from = valueLength) {
            pasteLength > freeSpace && (pasteLength = freeSpace)
            
            for (let i = 0; i < pasteLength; i++) {
                newValueArray[ placeholderCharsOrdered[i + from] ] = pasteData[i]
            }

            const newCaretPos = placeholderCharsOrdered[ pasteLength + from ]

            updateInputData(e, newValueArray, newCaretPos)
        }


        if (isE(LAST_FILLED_INDEX)) {
            if (LAST_FILLED_INDEX < prevCaretPos && prevCaretPos <= LAST_PLACEHOLDER_INDEX) pasteAll()
            else {
                let beforeCaretCharCount;
                for (let i = prevCaretPos - 1; i >= 0; i--) {
                    const charOrder = placeholdersIndexesMap[i]
                    if (isE(charOrder)) {
                        beforeCaretCharCount = charOrder + 1
                        break
                    }
                }

                const afterCaretPlaceholdersCount = maxLength - beforeCaretCharCount;
                
                if (shiftNextValue && afterCaretPlaceholdersCount > pasteLength) {
                    let decrementFrom = placeholdersIndexesMap[ LAST_FILLED_INDEX ]

                    const lastFilledPos = placeholdersIndexesMap[ LAST_FILLED_INDEX ] + 1
                    const overflow = (lastFilledPos + pasteLength) - maxLength;

                    overflow > 1 && (decrementFrom -= overflow)
                    
                    for (let i = decrementFrom, l = beforeCaretCharCount; i >= l; i--) {
                        newValueArray[ placeholderCharsOrdered[ i + pasteLength ]] = newValue[ placeholderCharsOrdered[i] ]
                    }
                }
                
                pasteAll(pasteLength, beforeCaretCharCount)
            }
        } else pasteAll()
    }

    _inputAttr.onChange = (e: ChangeEvent) => {
        const inputType = (e.nativeEvent as InputEvent).inputType;
        if (inputType == 'insertFromPaste') return;
        
        const { selectionStart, value: inputValue } = e.target;
        
        let nextCaretPos;
        let newValueArray: string[];


        if (inputType == 'insertText') {
            newValueArray = maskStore.lastInputValue.split('')
            const typedChar = (e.nativeEvent as InputEvent).data;
            const prevCaretPos = selectionStart - 1
            let indexToReplace;

            const selectionLength = selectionStart - (prevCaretPos + (inputValue.length - pattern.length))
            if (selectionLength) {
                //TODO
                return console.log('YET NOT IMPLEMENTED')
            }


            if (prevCaretPos < FIRST_PLACEHOLDER_INDEX && FIRST_PLACEHOLDER_INDEX != FIRST_FILLED_INDEX) {
                indexToReplace = FIRST_PLACEHOLDER_INDEX;
                nextCaretPos = placeholderCharsOrdered[1]

            } else if (prevCaretPos >= LAST_EMPTY_PLACEHOLDER_INDEX) {
                indexToReplace = LAST_EMPTY_PLACEHOLDER_INDEX;
                nextCaretPos = placeholderCharsOrdered[ placeholdersIndexesMap[LAST_EMPTY_PLACEHOLDER_INDEX] + 1 ]
            
            } else if (LAST_FILLED_INDEX == LAST_PLACEHOLDER_INDEX && LAST_FILLED_INDEX >= prevCaretPos
                && prevCaretPos > placeholderCharsOrdered[ placeholdersIndexesMap[LAST_FILLED_INDEX] - 1 ]) {

                indexToReplace = LAST_FILLED_INDEX;
                nextCaretPos = LAST_FILLED_INDEX + 1

                
            } else if (LAST_FILLED_INDEX < prevCaretPos && prevCaretPos < FIRST_EMPTY_PLACEHOLDER_INDEX) {
                indexToReplace = FIRST_EMPTY_PLACEHOLDER_INDEX;
                nextCaretPos = placeholderCharsOrdered[ placeholdersIndexesMap[FIRST_EMPTY_PLACEHOLDER_INDEX] + 1 ] || FIRST_EMPTY_PLACEHOLDER_INDEX + 1
                
            } else if (prevCaretPos <= LAST_FILLED_INDEX) {
                let nextPlaceholderCharIndex;
                for (let i = prevCaretPos; i <= LAST_FILLED_INDEX; i++) {
                    if (isE(placeholdersIndexesMap[i])) {
                        nextPlaceholderCharIndex = i;
                        break
                    }
                }

                if (shiftNextValue) {
                    const shiftEndCharIndex = isE(FIRST_EMPTY_PLACEHOLDER_INDEX) ? FIRST_EMPTY_PLACEHOLDER_INDEX : LAST_FILLED_INDEX;
                    const shiftEndPlacehodlerCharOrder = placeholdersIndexesMap[ shiftEndCharIndex ] - 1
                    const nextCharPlaceholderOrderIndex = placeholdersIndexesMap[nextPlaceholderCharIndex]

                    for (let i = shiftEndPlacehodlerCharOrder; i >= nextCharPlaceholderOrderIndex; i--) {
                        newValueArray [ placeholderCharsOrdered[i+1] ] = newValueArray[ placeholderCharsOrdered[i] ]
                    }
                }

                indexToReplace = nextPlaceholderCharIndex;
                nextCaretPos = placeholderCharsOrdered[ placeholdersIndexesMap[nextPlaceholderCharIndex] + 1 ]
            }

            newValueArray[indexToReplace] = typedChar
        } else {
            const isBackspace = inputType == 'deleteContentBackward'
            if (isBackspace || inputType == 'deleteContentForward') {
                if (!inputValue.length) return updateInputData(e, [], FIRST_PLACEHOLDER_INDEX)

                const prevCaretPos = selectionStart + 1

                if (valueLength) {
                    newValueArray = maskStore.lastInputValue.split('')
                    
                    const selectionLength = selectionStart - (prevCaretPos + (inputValue.length - pattern.length - 1))
                    if (selectionLength) {
                        //TODO
                        return console.log('YET NOT IMPLEMENTED')
                    }

                    if (isBackspace) {
                        let shouldBeDeleted: number;
            
                        if (prevCaretPos > LAST_FILLED_INDEX) {
                            shouldBeDeleted = LAST_FILLED_INDEX;

                            const lastFilledCharOrderIndex = placeholdersIndexesMap[LAST_FILLED_INDEX]
                            nextCaretPos = lastFilledCharOrderIndex
                                ?   placeholderCharsOrdered[lastFilledCharOrderIndex - 1] + 1
                                :   FIRST_PLACEHOLDER_INDEX
                        } else {
                            for (let i = prevCaretPos - 1; i >= FIRST_PLACEHOLDER_INDEX; i--) {
                                if (isE(placeholdersIndexesMap[i])) {
                                    const prevPlaceholder = placeholderCharsOrdered[placeholdersIndexesMap[i] - 1]
                                    nextCaretPos = isE(prevPlaceholder) ? prevPlaceholder + 1 : i;

                                    shouldBeDeleted = i;
                                    break
                                }
                            }
                        }
            
                        newValueArray[shouldBeDeleted] = valuePlaceholderChar
                    } else {
                        nextCaretPos = selectionStart;

                        let shouldBeDeleted;
                        for (let i = selectionStart; i < newValueArray.length; i++) {
                            if (isE(placeholdersIndexesMap[i])) {
                                shouldBeDeleted = i;
                                break
                            }
                        }
                        isE(shouldBeDeleted) && (newValueArray[shouldBeDeleted] = valuePlaceholderChar)
                    }
                } else {
                    prevCaretPos == FIRST_PLACEHOLDER_INDEX || setCaretPos((ref as Ref).current, FIRST_PLACEHOLDER_INDEX)
                    return
                }
            }
        }
        

        updateInputData(e, newValueArray, nextCaretPos)
    }

    _inputAttr.onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const nextCaretPos = isE(FIRST_EMPTY_PLACEHOLDER_INDEX)
            ?   FIRST_EMPTY_PLACEHOLDER_INDEX
            :   LAST_FILLED_INDEX + 1

        maskStore.caretPos = nextCaretPos;

        setCaretPos((ref as Ref).current, nextCaretPos)

        onFocus && onFocus(e)
    }
    
    const maskStore = useState({
        caretPos: FIRST_PLACEHOLDER_INDEX,
        lastInputValue: newValue
    })[0]
    maskStore.lastInputValue = newValue;

    useEffect(() => {
        const timeoutID = setCaretPos((ref as Ref).current, maskStore.caretPos)
        return () => { clearTimeout(timeoutID) }
    }, [ value ])
}


export default maskProcessor