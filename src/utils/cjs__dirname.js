const __dirname = meta => {
    const pathname = new URL('.', meta.url).pathname
    return pathname.substr(0, pathname.length - 1)
}


export default __dirname