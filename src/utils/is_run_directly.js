const isRunDirectly = ({ url }) => (
    url.replace('file://', '') == process.argv[1]
)


export default isRunDirectly