import fs from 'fs'


function requireJSON(path) {
    const jsonFileContent = fs.readFileSync(path, 'utf8')
    return JSON.parse(jsonFileContent)
}


export default requireJSON