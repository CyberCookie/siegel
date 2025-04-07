import fs from 'fs'

import type { ConfigObject } from '../types'


type Params = NonNullable<
    NonNullable<ConfigObject['server']>['ssl']
>



const extractSSL = ({ keyPath, certPath }: Params) => ({
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
})


export default extractSSL