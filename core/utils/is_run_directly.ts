const isRunDirectly = ({ url }: any) => (
    url.replace('file://', '') == process.argv[1]
)


export default isRunDirectly