const normalizeValue = (value: number) => (
    value > 1
        ?   1
        :   value < 0
            ?   0
            :   +value.toFixed(2)
)


export default normalizeValue