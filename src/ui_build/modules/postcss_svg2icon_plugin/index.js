const { dirname, posix }    = require('path')
const postcss               = require('postcss')
const crypto                = require('crypto')


const urlRegexp = /url\s*\((\s*"([^"]+)"|'([^']+)'|([^'")]+))\)/
function getUnresolvedIconPath(value) {
    const relativePathResult = urlRegexp.exec(value)
    if (!relativePathResult) {
        throw new Error(`Could not parse url "${value}".`)
    }
    return relativePathResult[2] || relativePathResult[3] || relativePathResult[4]
}


function getSvgPaths(postCssRoot, context) {
    let unresolved = new Set()
    let isResolved = false;
    const relative = []


    postCssRoot.walkDecls(({ prop, value }) => {
        if (prop == 'font-icon') {
            const unresolvedIconPath = getUnresolvedIconPath(value)
            isResolved || (isResolved = true);

            if (!unresolved.has(unresolvedIconPath)) {
                unresolved.add(unresolvedIconPath)
                relative.push(posix.relative('.', posix.join(context, unresolvedIconPath)))
            }
        }
    })
    
    unresolved = Array.from(unresolved)

    console.log({ unresolved, isResolved, relative })
    return { unresolved, isResolved, relative }
}


function replaceIconFontDeclarations({ fontName, postCssRoot, svgPaths }) {
    const cssPropValueMap = {
        'text-rendering': 'optimizeSpeed',
        '-webkit-font-smoothing': 'antialiased',
        '-moz-osx-font-smoothing': 'grayscale',
        'font-weight': 'normal',
        'font-family': ''
    }

    postCssRoot.walkDecls(decl => {
        if (decl.prop == 'font-icon') {
            cssPropValueMap['font-family'] = fontName;
            for (let prop in cssPropValueMap) {
                const value = cssPropValueMap[prop]
                decl.cloneBefore({ prop, value })
            }
    
            // Look up the index of the svg in the array to generate the unicode char position
            const iconCharCode = svgPaths.unresolved.indexOf(getUnresolvedIconPath(decl.value))
            const iconCharCodeHex = iconCharCode.toString(16)
            decl.value = '\'\\e' + '0'.repeat(Math.max(0, 3 - iconCharCodeHex.length)) + iconCharCodeHex + '\''
            // Turn `font-icon:` into `content:`
            decl.prop = 'content'
        }
    })
}


function addFontDeclaration({ fontName, postCssRoot, svgPaths }) {
    const options = {
        svgs: svgPaths.relative,
        name: fontName
    }

    const iconFontLoaderPath = posix.join(__dirname, 'loader.js')
    const iconFontPlaceholderPath = posix.join(__dirname, 'x.svg')
    // Use !! to tell webpack that we don't want any other loader to kick in
    const url = '!!' + iconFontLoaderPath + '?' + JSON.stringify(options) + '!~' + iconFontPlaceholderPath;
    console.log('font-family: ' + fontName + '; src:url(\'' + url + '\') format(\'woff\');')
    postCssRoot.prepend(postcss.parse(
        '@font-face { ' +
        'font-family: ' + fontName + '; src:url(\'' + url + '\') format(\'woff\');' +
        'font-weight: normal;' +
        'font-style: normal' +
        '}'
    ))
}



module.exports = options => postcss.plugin('postcss-svg2icon', config => (postCssRoot, result) => {
    if (!result || !result.opts || !result.opts.from) return;

    const svgPaths = getSvgPaths(postCssRoot, dirname(result.opts.from))
    if (svgPaths.isResolved) {

        // Generate a font icon name
        const md5sum = crypto.createHash('md5')
        md5sum.update(JSON.stringify(svgPaths.relative))
        let fontName = md5sum.digest('hex').substr(0, 6)
        // Prefix the fontname with a letter as fonts with a leading number are not allowed
        fontName = config.fontNamePrefix + String.fromCharCode(fontName.charCodeAt(0) + 20) + fontName.substr(1)
        
    
        const declarationParams = { fontName, postCssRoot, svgPaths }
    
        addFontDeclaration(declarationParams),
        replaceIconFontDeclarations(declarationParams)
    }
})(options)