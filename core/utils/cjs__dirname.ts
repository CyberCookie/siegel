const __dirname = (meta: ImportMeta) => {
    const { pathname } = new URL('.', meta.url)
    return pathname.substring(0, pathname.length - 1)
}


export default __dirname