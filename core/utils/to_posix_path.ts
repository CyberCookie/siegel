import { sep, posix } from 'path'


const toPosixPath = (path: string) => (
    sep == posix.sep
        ?   path
        :   path.split(sep).join(posix.sep)
)


export default toPosixPath