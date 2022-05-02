import fs from 'fs'


const extractSSL = ({ keyPath, certPath }) => ({
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
})


export default extractSSL