import fs from 'fs'


function requireJSON(path: string) {
    const jsonFileContent = fs.readFileSync(path, 'utf8')
    return JSON.parse(jsonFileContent)
}


export default requireJSON