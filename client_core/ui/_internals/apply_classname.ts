const applyClassName = (
    className: string | undefined = '',
    classNames: [ string | undefined, any ][]

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