type RouteParams = Obj<string>
type MatchCB<R> = (
    params: RouteParams,
    resolvedPathname: string
) => R | Promise<R> | undefined

type RegExpCache = Obj<{
    regex: RegExp
    keys: string[]
}>



const regexCache: RegExpCache = {}
function getCompiledPattern(pattern: string) {
    let cached = regexCache[pattern]
    if (!cached) {
        const keys: string[] = []
        const regexStr = pattern.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
            keys.push(key)
            return '([^/]+)'
        })

        regexCache[pattern] = cached = {
            regex: new RegExp(`^${regexStr}$`),
            keys
        }
    }


    return cached
}

function matchRoute<R>(pathname: string, parametrizedRoutes: Obj<MatchCB<R>>) {
    for (const pattern in parametrizedRoutes) {
        const { regex, keys } = getCompiledPattern(pattern)

        const match = regex.exec(pathname)
        if (match) {
            const resolvedParams: RouteParams = {}
            let resolvedPathname = pattern

            for (let i = 0; i < keys.length; i++) {
                const val = match[i + 1]
                resolvedParams[keys[i]] = val
                resolvedPathname = resolvedPathname.replace(':' + keys[i], val)
            }

            return parametrizedRoutes[pattern]!(resolvedParams, resolvedPathname)
        }
    }
}


export default matchRoute