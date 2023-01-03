const results: any = {}

const clearState = (id: string) => { delete results[id] }

/**
 * Executes callback to memoize result and returns it
 * whenever called until dependencies have changed
 *
 * @param cb result to memoize
 * @param dependencyValue Value to compare with one from previous callback execution in order to determine whether to return memoized value
 * @param id Memoization ID
 * @returns memoized result
 */
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


export { clearState }
export default memo