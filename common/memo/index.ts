let id = 0
const getUniqID = () => id++


const results: any = {}

const clearState = (id: number) => { delete results[id] }

function memo(cb: Function, dependencyValue: number | string | boolean, id: number | string) {
    const resultData = results[id]

    if (!resultData) {
        const result = cb()
        results[id] = {
            result,
            depValue: dependencyValue
        }

        return result

    } else {
        const { depValue } = resultData

        if (depValue != dependencyValue) {
            resultData.result = cb()
            resultData.depValue = dependencyValue
        }

        return resultData.result
    }
}


export { getUniqID, clearState }
export default memo