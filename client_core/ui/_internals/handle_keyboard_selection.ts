import isExists from '../../../common/is/exists'
import * as keyCodes from './key_codes'


type Handlers = {
    onEnter(): void
    onDelete(): void
}

type Store = ReactStore<{
    [key: string]: any
    arrowSelectIndex: number | undefined
}>

type Options = {
    disabled?: boolean
}[]

type SelectedOptionIndex = number | undefined


function getKeyboardOptionIndex(
    commonParams: {
        options: Options
        selectedOptionIndex: SelectedOptionIndex
        arrowSelectIndex: number | undefined
        isUp: boolean
    }
) {

    const { options, selectedOptionIndex, arrowSelectIndex, isUp } = commonParams

    const { length } = options
    const maxIndex = length - 1
    const incrementValue = isUp ? -1 : 1
    const passedValuesSet = new Set<number>([])

    let startFrom = isExists(arrowSelectIndex)
        ?   arrowSelectIndex + incrementValue
        :   isUp ? maxIndex : 0
    startFrom = startFrom < 0
        ?   maxIndex
        :   startFrom > maxIndex ? 0 : startFrom


    for (let i = startFrom; 0 <= i && i < length; i += incrementValue) {
        if (i != selectedOptionIndex && !options[i].disabled) return i

        passedValuesSet.add(i)

        if (isUp) i == 0 && (i = maxIndex)
        else i == maxIndex && (i = -1)

        if (passedValuesSet.size == maxIndex) return undefined
    }
}

function handleKeyboardSelect(
    selectionParams: {
        keyCode: string
        selectStore: Store
        options: Options
        selectedOptionIndex: SelectedOptionIndex
    },
    handlers: Handlers
) {

    const { selectStore, keyCode, options, selectedOptionIndex } = selectionParams
    const { onDelete, onEnter } = handlers

    const [ state, setState ] = selectStore
    const { arrowSelectIndex } = state

    const isUp = keyCode == keyCodes.UP
    const isArrowIndexExists = isExists(arrowSelectIndex)

    if (isUp || keyCode == keyCodes.DOWN) {
        state.arrowSelectIndex = getKeyboardOptionIndex({
            options, selectedOptionIndex, arrowSelectIndex, isUp
        })
        isExists(state.arrowSelectIndex) && setState({ ...state })

    } else if (keyCode == keyCodes.DELETE) onDelete()

    else if (isArrowIndexExists && keyCode == keyCodes.ENTER) onEnter()
}


export default handleKeyboardSelect
export type { Store }