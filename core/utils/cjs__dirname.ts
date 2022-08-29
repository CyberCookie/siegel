import { fileURLToPath } from 'url'
import { dirname } from 'path'


const __dirname = ({ url }: ImportMeta) => dirname( fileURLToPath(url) )


export default __dirname