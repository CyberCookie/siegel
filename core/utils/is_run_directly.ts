const isRunDirectly = ({ url }: ImportMeta) => (
    url.replace('file://', '') == process.argv[1]
)


export default isRunDirectly