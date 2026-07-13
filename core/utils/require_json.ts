async function requireJSON<O extends Obj = Obj>(path: string): Promise<O> {
    const jsonFileContent: O = await Bun.file(path).json()
    return jsonFileContent
}


export default requireJSON