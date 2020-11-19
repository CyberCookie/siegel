const { dirname, posix }    = require('path')
const crypto                = require('crypto')
const postcss               = require('postcss')

const iconToFont            = require('./icons_to_font.js')


const getUnresolvedIconPath = value => value.substr(1, value.length - 2)

const cssPropValueMap = {
    'text-rendering': 'optimizeSpeed',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    'font-weight': 'normal',
    'font-style': 'normal'
}
function processFontIconCSSProps(postCssRoot, context, fontNamePrefix) {
    let absolutePathsIndex = {}
    let cssValueToAbsolutePath = {}

    let isResolved = false;
    let fontName;

    const absolute = []
    const unresolved = []

    let rootValue, rootDecl;
    let i = 0
    postCssRoot.walkDecls(decl => {
        const { prop, value } = decl;

        if (prop == 'font-icon-dest') {
            console.log(value, typeof value, value.toString())
            rootDecl = decl;
            rootValue = getUnresolvedIconPath(value)
        } else if (prop == 'font-icon') {
            const unresolvedValue = getUnresolvedIconPath(value)
            isResolved || (isResolved = true)

            const absolutePath = posix.join(context, unresolvedValue)
            cssValueToAbsolutePath[value] = absolutePath;


            if (!absolutePathsIndex[absolutePath]) {
                absolutePathsIndex[absolutePath] = ++i;
                
                unresolved.push(unresolvedValue)
                absolute.push(absolutePath)
            }
            
            const iconIndex = (absolutePathsIndex[absolutePath] - 1).toString(16)
            decl.prop = 'content'
            decl.value = '\'\\e' + '0'.repeat(Math.max(0, 3 - iconIndex.length)) + iconIndex + '\''
        }
    })

    
    if (rootDecl) {
        const checkSum = crypto
            .createHash('md5')
            .update(JSON.stringify(unresolved))
            .digest('hex')

        fontName = `${fontNamePrefix}Iconfont_${checkSum}`
    
        cssPropValueMap['font-family'] = fontName;
        for (let prop in cssPropValueMap) {
            const value = cssPropValueMap[prop]
            rootDecl.cloneBefore({ prop, value })
        }
        rootDecl.remove()
    }


    return { isResolved, absolute, fontName, rootValue }
}


// function addFontDeclaration({ fontName, postCssRoot, svgPaths }) {
//     const options = {
//         svgs: svgPaths.absolute,
//         name: fontName
//     }
    
//     const iconFontLoaderPath = posix.join(__dirname, 'loader.js')
//     const iconFontPlaceholderPath = posix.join(__dirname, 'placeholder.svg')
    
//     // Use !! to tell webpack that we don't want any other loader to kick in
    
//     const loaderResult = '!!' + iconFontLoaderPath + '?' + JSON.stringify(options) + '!~' + iconFontPlaceholderPath;
//     postCssRoot.prepend(postcss.parse(
//         '@font-face { ' +
//         'font-family: ' + fontName + '; src:url(\'' + loaderResult + '\') format(\'woff\');' +
//         'font-weight: normal;' +
//         'font-style: normal;' +
//         '}'
//     ))
//   }
const addFontDeclaration = ({ postCssRoot, svgPaths }, isWoff2) => iconToFont({
    svgs: svgPaths.absolute,
    name: svgPaths.fontName
}).then(font => {
    const base64Font = Buffer.from(font).toString('base64')
    const fontURL = `src:url('data:application/x-font-woff;charset=utf-8;base64,${base64Font}')`
    const fontFormat = `format('woff${isWoff2 ? 2 : ''}')`

    postCssRoot.prepend(
        postcss.parse(
            `@font-face{font-family:${svgPaths.fontName};${fontURL}${fontFormat}}`
        )
    )
})



module.exports = options => postcss.plugin('postcss-svg2icon', ({ isWoff2, fontNamePrefix }) => (postCssRoot, result) => {
    if (!result || !result.opts || !result.opts.from) return;

    const svgPaths = processFontIconCSSProps(postCssRoot, dirname(result.opts.from), fontNamePrefix)
    if (svgPaths.isResolved) {
        return addFontDeclaration({ postCssRoot, svgPaths }, isWoff2)
    }
})(options)