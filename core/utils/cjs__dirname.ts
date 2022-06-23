const __dirname = (meta: any) => {
    const { pathname } = new URL('.', meta.url)
    return pathname.substr(0, pathname.length - 1)
}


export default __dirname