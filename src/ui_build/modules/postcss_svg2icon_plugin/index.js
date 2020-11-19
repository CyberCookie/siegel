const { dirname, posix, join }  = require('path')
const crypto                    = require('crypto')
const postcss                   = require('postcss')

const iconToFont = require('./icons_to_font.js')


const urlRegexp = /url\s*\((\s*"([^"]+)"|'([^']+)'|([^'")]+))\)/
function getUnresolvedIconPath(value) {
    const relativePathResult = urlRegexp.exec(value)
    if (!relativePathResult) {
        throw new Error(`Could not parse url "${value}".`)
    }
    return relativePathResult[2] || relativePathResult[3] || relativePathResult[4]
}



const cssPropValueMap = {
    'text-rendering': 'optimizeSpeed',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    'font-weight': 'normal',
    'font-style': 'normal'
}


function getSvgPaths(postCssRoot, context) {
    let absolutePathsIndex = {}
    let cssValueToAbsolutePath = {}

    let isResolved = false;
    const absolute = []
    const unresolved = []


    let rootDecl;
    let i = 0
    postCssRoot.walkDecls(decl => {
        const { prop, value } = decl;

        if (prop == 'font-icon-dest') {
            rootDecl = decl;
        } else if (prop == 'font-icon') {
            const unresolvedIconPath = getUnresolvedIconPath(value)
            isResolved || (isResolved = true);

            const absolutePath = posix.join(context, unresolvedIconPath)
            cssValueToAbsolutePath[value] = absolutePath;


            if (!absolutePathsIndex[absolutePath]) {
                absolutePathsIndex[absolutePath] = ++i;
                
                unresolved.push(unresolvedIconPath)
                absolute.push(absolutePath)
            }
            
            // decl.prop = 'content'
            // decl.value = absolutePathsIndex[absolutePath]
        }
    })

    // const checkSum = crypto
    //     .createHash('md5')
    //     .update(JSON.stringify(unresolved))
    //     .digest('hex')
    // const fontName = `Iconfont_${checkSum}`

    // cssPropValueMap['font-family'] = fontName;
    // for (let prop in cssPropValueMap) {
    //     const value = cssPropValueMap[prop]
    //     rootDecl.cloneBefore({ prop, value })
    // }
    // rootDecl.remove()



    return { absolutePathsIndex, cssValueToAbsolutePath, unresolved, isResolved, absolute/*, fontName*/ }
}


function replaceIconFontDeclarations({ fontName, postCssRoot, svgPaths }) {
    let fontPath; 
    postCssRoot.walkDecls(decl => {
        if (decl.prop == 'font-icon-dest') {
            cssPropValueMap['font-family'] = fontName;
            for (let prop in cssPropValueMap) {
                const value = cssPropValueMap[prop]
                decl.cloneBefore({ prop, value })
            }

            fontPath = getUnresolvedIconPath(decl.value)
            decl.remove()
        } else if (decl.prop == 'font-icon') {
            const iconCharCodeHex = svgPaths.unresolved
                .indexOf(getUnresolvedIconPath(decl.value))
                .toString(16)

            decl.value = '\'\\e' + '0'.repeat(Math.max(0, 3 - iconCharCodeHex.length)) + iconCharCodeHex + '\''
            decl.prop = 'content'
        }
    })

    return fontPath
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
const addFontDeclaration = ({ fontName, postCssRoot, svgPaths, options }) => iconToFont({
    svgs: svgPaths.absolute,
    name: fontName
}).then(font => {
    const base64Font = Buffer.from(font).toString('base64')
    const fontURL = `src:url('data:application/x-font-woff;charset=utf-8;base64,${base64Font}')`
    const fontFormat = `format('woff${options.isWoff2 ? 2 : ''}')`

    postCssRoot.prepend(
        postcss.parse(
            `@font-face{font-family:${fontName};${fontURL}${fontFormat}}`
        )
    )
})



module.exports = (options, x) => postcss.plugin('postcss-svg2icon', config => (postCssRoot, result) => {
    if (!result || !result.opts || !result.opts.from) return;

    const svgPaths = getSvgPaths(postCssRoot, dirname(result.opts.from))
    console.log(svgPaths)
    if (svgPaths.isResolved) {
        const checkSum = crypto
            .createHash('md5')
            .update(JSON.stringify(svgPaths.unresolved))
            .digest('hex')

        const declarationParams = {
            postCssRoot, svgPaths, options,
            fontName: `${config.fontNamePrefix || 'Iconfont'}_${checkSum}`
        }
        
        
        const fontPath = replaceIconFontDeclarations(declarationParams)


        return addFontDeclaration(declarationParams)
    }
})(options)