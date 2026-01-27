import fs from 'fs'


function requireJSON<O extends Obj = Obj>(path: string): O {
    const jsonFileContent = fs.readFileSync(path, 'utf8')
    return JSON.parse(jsonFileContent)
}


export default requireJSON