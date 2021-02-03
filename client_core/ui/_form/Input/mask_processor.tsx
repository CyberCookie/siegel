import { useState, useEffect } from 'react'

import isE from '../../../utils/is_exists'

import type { Props } from './types'


type Ref = React.MutableRefObject<HTMLInputElement>
type ClipboardEvent = React.ClipboardEvent<HTMLInputElement>
type ChangeEvent = React.ChangeEvent<HTMLInputElement>
type MaskCharData = {
    index?: number
    prev?: number
    prevFilled?: number
    next?: number
    nextFilled?: number
    isFilled?: boolean
}

const setCaretPos = (input: HTMLInputElement, caretPos: number) => setTimeout(() => { input.setSelectionRange(caretPos, caretPos) })

const maskProcessor: Props['mask']['processor'] = (mask, _inputAttr) => {
    const { patternValueChar, valuePlaceholderChar = ' ', shiftNextValue = true, copyMask, pattern } = mask;
    const { value, ref, onChange, onFocus } = _inputAttr;
    
    const valueLength = value.length;

    // const placeholdersIndexesMap: Indexable<number> = {}
    const placeholdersIndexesMap: Indexable<MaskCharData> = {}
    const placeholderCharsOrdered: number[] = []

    let FIRST_EMPTY_PLACEHOLDER_INDEX: number;
    let FIRST_FILLED_INDEX: number;
    let LAST_FILLED_INDEX: number;
    
    
    let newValue = ''
    // for (let i = 0, k = 0, l = pattern.length; i < l; i++) {
    //     const maskChar = pattern[i]

    //     if (maskChar === patternValueChar) {
    //         placeholderCharsOrdered.push(i)
    //         placeholdersIndexesMap[i] = placeholderCharsOrdered.length - 1
            
    //         if (isE(value[k])) {
    //             newValue += value[k]
    //             k++

    //             isE(FIRST_FILLED_INDEX) || (FIRST_FILLED_INDEX = i)
    //             LAST_FILLED_INDEX = i
    //         } else {
    //             newValue += valuePlaceholderChar;
    //             isE(FIRST_EMPTY_PLACEHOLDER_INDEX) || (FIRST_EMPTY_PLACEHOLDER_INDEX = i)
    //         }
    //     } else newValue += maskChar
    // }
    for (let i = 0, k = 0, l = pattern.length; i < l; i++) {
        const maskChar = pattern[i]
        const placeholdersLength = placeholderCharsOrdered.length;

        const charData: MaskCharData = {}
        isE(LAST_FILLED_INDEX) && (charData.prevFilled = LAST_FILLED_INDEX)
        
        if (maskChar === patternValueChar) {
            charData.index = placeholdersLength;
            placeholderCharsOrdered.push(i)
            
            if (isE(value[k])) {
                charData.isFilled = true;
                newValue += value[k]
                k++

                isE(FIRST_FILLED_INDEX) || (FIRST_FILLED_INDEX = i)
                LAST_FILLED_INDEX = i
            } else {
                newValue += valuePlaceholderChar;
                isE(FIRST_EMPTY_PLACEHOLDER_INDEX) || (FIRST_EMPTY_PLACEHOLDER_INDEX = i)
            }
        } else newValue += maskChar;
        
        placeholdersLength && (charData.prev = placeholderCharsOrdered[ placeholdersLength - 1 ])
        placeholdersIndexesMap[i] = charData
    }
    
    const FIRST_PLACEHOLDER_INDEX = placeholderCharsOrdered[0]
    const LAST_PLACEHOLDER_INDEX = placeholderCharsOrdered[ placeholderCharsOrdered.length - 1 ]
    const LAST_EMPTY_PLACEHOLDER_INDEX = placeholderCharsOrdered[ valueLength ]
    
    if (isE(LAST_FILLED_INDEX)) {
        let nextFilled, next;
        for (let i = LAST_PLACEHOLDER_INDEX; i >= 0; i--) {
            const charData = placeholdersIndexesMap[i]
            isE(next) && (charData.next = next)
            isE(nextFilled) && (charData.nextFilled = nextFilled)

            const { index, isFilled } = charData;
            if (isE(index)) {
                next = i;
                isFilled && (nextFilled = i)
            }
        }
    }

    _inputAttr.value = newValue;


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

        //TODO
        console.log('changed')
        onChange(e as ChangeEvent)
    }
    

    copyMask || (_inputAttr.onCopy = (e: ClipboardEvent) => {
        const { selectionStart, selectionEnd } = (e.target as HTMLInputElement)
        const valueArray = maskStore.lastInputValue.split('')

        let valueToCopy = ''
        for (let i = selectionStart; i < selectionEnd; i++) {
            placeholdersIndexesMap[i].isFilled && (valueToCopy += valueArray[i])
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
                newValueArray[ placeholderCharsOrdered[ i + from ]] = pasteData[i]
            }
            
            const newCaretPos = placeholderCharsOrdered[ pasteLength + from ]

            updateInputData(e, newValueArray, newCaretPos)
        }


        if (isE(LAST_FILLED_INDEX)) {
            if (LAST_FILLED_INDEX < prevCaretPos && prevCaretPos <= LAST_PLACEHOLDER_INDEX) pasteAll()
            else {
                // let beforeCaretCharCount;
                // for (let i = prevCaretPos - 1; i >= 0; i--) {
                //     const { index } = placeholdersIndexesMap[i]
                //     if (isE(index)) {
                //         beforeCaretCharCount = index + 1
                //         break
                //     }
                // }
                const prevPlaceholder = placeholdersIndexesMap[ placeholdersIndexesMap[prevCaretPos].prev ]
                const beforeCaretCharCount = isE(prevPlaceholder) ? prevPlaceholder.index + 1 : 0


                const afterCaretPlaceholdersCount = maxLength - beforeCaretCharCount;
                
                if (shiftNextValue && afterCaretPlaceholdersCount > pasteLength) {
                    let decrementFrom = placeholdersIndexesMap[ LAST_FILLED_INDEX ].index;

                    const lastFilledPos = placeholdersIndexesMap[ LAST_FILLED_INDEX ].index + 1
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
                nextCaretPos = placeholdersIndexesMap[LAST_EMPTY_PLACEHOLDER_INDEX].next;
                // nextCaretPos = placeholderCharsOrdered[ placeholdersIndexesMap[LAST_EMPTY_PLACEHOLDER_INDEX].index + 1 ]
            
            } else if (LAST_FILLED_INDEX == LAST_PLACEHOLDER_INDEX && LAST_FILLED_INDEX >= prevCaretPos
                && prevCaretPos > placeholdersIndexesMap[LAST_FILLED_INDEX].prev) {

                indexToReplace = LAST_FILLED_INDEX;
                nextCaretPos = LAST_FILLED_INDEX + 1

                
            } else if (LAST_FILLED_INDEX < prevCaretPos && prevCaretPos < FIRST_EMPTY_PLACEHOLDER_INDEX) {
                console.log(444)
                indexToReplace = FIRST_EMPTY_PLACEHOLDER_INDEX;
                nextCaretPos = FIRST_EMPTY_PLACEHOLDER_INDEX + 1
                //nextCaretPos = placeholderCharsOrdered[ placeholdersIndexesMap[FIRST_EMPTY_PLACEHOLDER_INDEX].next ] || FIRST_EMPTY_PLACEHOLDER_INDEX + 1
                
            } else if (prevCaretPos <= LAST_FILLED_INDEX) {
                const { next, index } = placeholdersIndexesMap[prevCaretPos]
                const nextPlaceholderCharIndex = isE(index) ? prevCaretPos : next;

                // let nextPlaceholderCharIndex;
                // for (let i = prevCaretPos; i <= LAST_FILLED_INDEX; i++) {
                //     if (isE(placeholdersIndexesMap[i].index)) {
                //         nextPlaceholderCharIndex = i;
                //         break
                //     }
                // }


                if (shiftNextValue) {
                    const shiftEndCharIndex = isE(FIRST_EMPTY_PLACEHOLDER_INDEX) ? FIRST_EMPTY_PLACEHOLDER_INDEX : LAST_FILLED_INDEX;
                    const shiftEndPlacehodlerCharOrder = placeholdersIndexesMap[ shiftEndCharIndex ].index - 1
                    const nextCharPlaceholderOrderIndex = placeholdersIndexesMap[nextPlaceholderCharIndex].index;

                    for (let i = shiftEndPlacehodlerCharOrder; i >= nextCharPlaceholderOrderIndex; i--) {
                        newValueArray[ placeholderCharsOrdered[ i + 1 ]] = newValueArray[ placeholderCharsOrdered[i] ]
                    }
                }

                indexToReplace = nextPlaceholderCharIndex;
                nextCaretPos = placeholdersIndexesMap[nextPlaceholderCharIndex].next
                // nextCaretPos = placeholderCharsOrdered[ placeholdersIndexesMap[nextPlaceholderCharIndex].index + 1 ]
            }

            newValueArray[indexToReplace] = typedChar
        } else {
            const isBackspace = inputType == 'deleteContentBackward'
            if (isBackspace || inputType == 'deleteContentForward') {
                if (!inputValue.length) return updateInputData(e, [], FIRST_PLACEHOLDER_INDEX)

                const prevCaretPos = selectionStart + 1

                if (valueLength) {
                    newValueArray = maskStore.lastInputValue.split('')
                    
                    const selectionLength = selectionStart - (prevCaretPos + (inputValue.length - pattern.length))
                    if (selectionLength) {
                        // TODO
                        return console.log('YET NOT IMPLEMENTED')
                    }

                    if (isBackspace) {
                        if (prevCaretPos <= FIRST_PLACEHOLDER_INDEX) return setCaretPos((ref as Ref).current, LAST_FILLED_INDEX + 1)
                        else {
                            const { prevFilled, isFilled } = placeholdersIndexesMap[selectionStart]
                            let newPrevFilled, indexToReplace;

                            if (isFilled) {
                                newPrevFilled = prevFilled;
                                indexToReplace = selectionStart
                            } else {
                                newPrevFilled = placeholdersIndexesMap[prevFilled].prevFilled;
                                indexToReplace = prevFilled
                            }

                            newValueArray[indexToReplace] = valuePlaceholderChar;
                            nextCaretPos = isE(newPrevFilled) ? newPrevFilled + 1 : FIRST_PLACEHOLDER_INDEX
                        }


                        // let shouldBeDeleted: number;
                        // if (prevCaretPos > LAST_FILLED_INDEX) {
                        //     const { index, prevFilled } = placeholdersIndexesMap[LAST_FILLED_INDEX]
                        //     nextCaretPos = index ? prevFilled + 1 : FIRST_PLACEHOLDER_INDEX
                            
                        //     shouldBeDeleted = LAST_FILLED_INDEX;
                        // } else {
                        //     for (let i = prevCaretPos - 1; i >= FIRST_PLACEHOLDER_INDEX; i--) {
                        //         if (isE(placeholdersIndexesMap[i].index)) {
                        //             const prevPlaceholder = placeholderCharsOrdered[placeholdersIndexesMap[i].index - 1]
                        //             nextCaretPos = isE(prevPlaceholder) ? prevPlaceholder + 1 : i;

                        //             shouldBeDeleted = i;
                        //             break
                        //         }
                        //     }
                        // }
            
                        // newValueArray[shouldBeDeleted] = valuePlaceholderChar
                    } else {
                        const { nextFilled, isFilled } = placeholdersIndexesMap[selectionStart]
                        
                        const indexToReplace = isFilled ? selectionStart : nextFilled;
                        isE(indexToReplace) && (newValueArray[indexToReplace] = valuePlaceholderChar)

                        nextCaretPos = selectionStart < FIRST_PLACEHOLDER_INDEX ? FIRST_PLACEHOLDER_INDEX : selectionStart

                        // let shouldBeDeleted;
                        // for (let i = selectionStart; i < newValueArray.length; i++) {
                        //     if (isE(placeholdersIndexesMap[i].index)) {
                        //         shouldBeDeleted = i;
                        //         break
                        //     }
                        // }
                        // isE(shouldBeDeleted) && (newValueArray[shouldBeDeleted] = valuePlaceholderChar)
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