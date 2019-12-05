/**
 * Sort function used as a callback in `Array.sort()` method
 * @param  {(number | string)} a - previous value
 * @param  {(number | string)} b - next value
 * @return {number} comparsion result
 */
const simpleSort = (a: number | string, b: number | string): number => a > b ? 1 : -1;


export default simpleSort