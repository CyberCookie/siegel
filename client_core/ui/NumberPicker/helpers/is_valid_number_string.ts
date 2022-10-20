const isValidNumberString = (stringValue: string, numberValue: number) => (
    !isNaN(numberValue)
        &&  stringValue[ stringValue[0] == '-' ? 1 : 0 ] != '.'
        &&  stringValue.at(-1) != '.'
)


export default isValidNumberString