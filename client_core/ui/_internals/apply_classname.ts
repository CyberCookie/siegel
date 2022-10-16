const applyClassName = (
    className: string | undefined = '',
    classNames: [ string | undefined, boolean | undefined ][]

) => (
    classNames.reduce((acc, [ conditionalClassName, condition ]) => (
        conditionalClassName && condition
            ?   `${acc} ${conditionalClassName}`
            :   acc
        ),
        className
    ) || undefined
)


export default applyClassName