import fs from 'fs'


const extractSSL = ({ keyPath, certPath }: any) => ({
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
})


export default extractSSL