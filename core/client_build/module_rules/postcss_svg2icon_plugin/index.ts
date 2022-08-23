//TODO: external font file
//TODO: group orphans to share single selector


import path from 'path'
import { createHash } from 'crypto'
import postcss, { Declaration } from 'postcss'

import iconToFont from './icons_to_font.js'

import type { Svg2FontConverterPlugin, GetFontFaceNodeFn } from './types'


const getFontFaceNode: GetFontFaceNodeFn = (opts, handlers) => {
    const { isWoff2, svgs, fontNamePrefix } = opts
    const { onFontName, onFinish } = handlers

    const checksum = createHash('md5')
        .update(JSON.stringify(svgs))
        .digest('hex')

    const fontName = `${fontNamePrefix}Iconfont_${checksum}`

    onFontName(fontName)


    return iconToFont({ fontName, isWoff2, svgs })
        .then(font => {
            const base64Font = Buffer.from(font).toString('base64')
            const fontURL = `src:url('data:application/x-font-woff;charset=utf-8;base64,${base64Font}')`
            const fontFormat = `format('woff${isWoff2 ? 2 : ''}')`

            onFinish(
                postcss.parse(
                    `@font-face{font-family:${fontName};${fontURL}${fontFormat}}`
                )
            )
        })
}


const cssPropValueMap = {
    'text-rendering': 'optimizeSpeed',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    'font-weight': 'normal',
    'font-style': 'normal',
    'font-family': ''
}

const pluginCssDeclarationsSet = new Set([
    'font-icon', 'font-icon-orphan', 'font-icon-common'
])


const applyFontDeclarations = (decl: Declaration, fontName: string) => {
    cssPropValueMap['font-family'] = fontName
    for (const prop in cssPropValueMap) {
        decl.cloneBefore({
            prop,
            value: cssPropValueMap[prop as keyof typeof cssPropValueMap]
        })
    }
}

const svgToFontConvertPlugin: Svg2FontConverterPlugin = ({ fontNamePrefix = '', isWoff2, iconsRoot }) => ({
    postcssPlugin: 'postcss-svg2icon',
    prepare() {
        cssPropValueMap['font-family'] = ''

        const result = {
            absolute: [] as string[],
            orphansDecl: [] as Declaration[],
            rootDecl: undefined as Declaration | undefined
        }

        const absolutePathsIndex: Indexable<number> = {}

        let i = 0


        return {
            Declaration(decl) {
                const { prop, value } = decl

                if (pluginCssDeclarationsSet.has(prop)) {
                    if (prop.endsWith('-common')) { //TODO:?
                        result.rootDecl = decl

                    } else {
                        const absolutePath = path.join(iconsRoot, value)

                        if (!absolutePathsIndex[absolutePath]) {
                            absolutePathsIndex[absolutePath] = ++i
                            result.absolute.push(absolutePath)
                        }

                        const iconIndex = (absolutePathsIndex[absolutePath] - 1).toString(16)
                        decl.prop = 'content'
                        decl.value = '\'\\e' + '0'.repeat(Math.max(0, 3 - iconIndex.length)) + iconIndex + '\''


                        if (prop.endsWith('-orphan')) {
                            result.orphansDecl.push(decl)
                        }
                    }
                }
            },

            OnceExit(postCssRoot) {
                const { rootDecl, absolute, orphansDecl } = result

                if (absolute.length) {
                    return getFontFaceNode(
                        {
                            isWoff2, fontNamePrefix,
                            svgs: absolute
                        },
                        {
                            onFontName(fontName) {
                                if (rootDecl) {
                                    applyFontDeclarations(rootDecl, fontName)
                                    rootDecl.remove()

                                } else {
                                    orphansDecl.forEach(decl => {
                                        applyFontDeclarations(decl, fontName)
                                    })
                                }
                            },
                            onFinish(postcssNode) {
                                postCssRoot.prepend(postcssNode)
                            }
                        }
                    )
                }
            }
        }
    }
})


export default svgToFontConvertPlugin