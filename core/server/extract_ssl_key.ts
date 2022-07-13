import fs from 'fs'

import type { ConfigFinal } from '../types'


const extractSSL = ({ keyPath, certPath }: NonNullable<ConfigFinal['server']['ssl']>) => ({
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
})


export default extractSSL