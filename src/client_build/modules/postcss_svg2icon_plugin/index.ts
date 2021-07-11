const { dirname, posix }    = require('path')
const { createHash }        = require('crypto')
const postcss               = require('postcss')

const iconToFont            = require('./icons_to_font')



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

const getUnresolvedIconPath = value => value.substr(1, value.length - 2)

const cssPropValueMap = {
    'text-rendering': 'optimizeSpeed',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    'font-weight': 'normal',
    'font-style': 'normal'
}


module.exports = ({ fontNamePrefix, isWoff2 }) => ({
    postcssPlugin: 'postcss-svg2icon',
    prepare(_result) {
        const context = dirname(_result.opts.from)

        const result = {
            // rootValue: '',
            absolute: []
        }

        const absolutePathsIndex = {}
        // const cssValueToAbsolutePath = {}
        const unresolved = []

        let rootDecl
        let i = 0

        return {
            Declaration(decl) {
                const { prop, value } = decl

                // TODO?: for the font to file extraction purposes (font-icon-dest: './assets/fonts/font_icon.')
                if (prop == 'font-icon-dest') {
                    rootDecl = decl
                    // result.rootValue = getUnresolvedIconPath(value)
                } else
                if (prop == 'font-icon') {
                    const unresolvedValue = getUnresolvedIconPath(value)
                    const absolutePath = posix.join(context, unresolvedValue)


                    // cssValueToAbsolutePath[value] = absolutePath //TODO?: use absolute paths

                    if (!absolutePathsIndex[absolutePath]) {
                        absolutePathsIndex[absolutePath] = ++i

                        unresolved.push(unresolvedValue)
                        result.absolute.push(absolutePath)
                    }

                    const iconIndex = (absolutePathsIndex[absolutePath] - 1).toString(16)
                    decl.prop = 'content'
                    decl.value = '\'\\e' + '0'.repeat(Math.max(0, 3 - iconIndex.length)) + iconIndex + '\''
                }
            },

            OnceExit(postCssRoot) {
                if (result.absolute.length && rootDecl) {
                    const checkSum = createHash('md5')
                        .update(JSON.stringify(unresolved))
                        .digest('hex')

                    const fontName = `${fontNamePrefix}Iconfont_${checkSum}`

                    cssPropValueMap['font-family'] = fontName
                    for (const prop in cssPropValueMap) {
                        rootDecl.cloneBefore({
                            prop,
                            value: cssPropValueMap[prop]
                        })
                    }
                    rootDecl.remove()

                    return iconToFont({
                        fontName,
                        svgs: result.absolute,
                        woff2: isWoff2
                    }).then(font => {
                        const base64Font = Buffer.from(font).toString('base64')
                        const fontURL = `src:url('data:application/x-font-woff;charset=utf-8;base64,${base64Font}')`
                        const fontFormat = `format('woff${isWoff2 ? 2 : ''}')`

                        postCssRoot.prepend(
                            postcss.parse(
                                `@font-face{font-family:${fontName};${fontURL}${fontFormat}}`
                            )
                        )
                    })
                }
            }
        }
    }
})
module.exports.postcss = true
export {}