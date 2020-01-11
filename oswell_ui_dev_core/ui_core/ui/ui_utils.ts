type PropsComponentBase = {
    className?: string
}

type PropsComponentThemed = {
    theme?: Indexable<string>
} & PropsComponentBase



function setDefaultProps
<T extends PropsComponentThemed, U extends PropsComponentThemed>
(defaultProps: T, newDefaultProps: U) {
    return Object.assign(defaultProps, newDefaultProps)
}


function extractProps
<T extends PropsComponentThemed, U extends PropsComponentThemed>
(defaultProps: T, props: U) {

    let { className, theme } = props;
    let { className: defaultClassName, theme: defaultTheme } = defaultProps
    let result = Object.assign({}, defaultProps, props)

    if (className && defaultClassName) {
        result.className += ` ${defaultClassName}`
    }

    if (theme && defaultTheme) {
        result.theme = Object.assign({}, defaultTheme, theme)
    }

    return result
}


export { setDefaultProps, extractProps, PropsComponentBase, PropsComponentThemed }