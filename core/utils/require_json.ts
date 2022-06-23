import fs from 'fs'


function requireJSON(path: any) {
    const jsonFileContent = fs.readFileSync(path, 'utf8')
    return JSON.parse(jsonFileContent)
}


export default requireJSON