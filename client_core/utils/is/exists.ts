export default <T = any>(value: T): value is Exclude<T, undefined> => value !== void 0