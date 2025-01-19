import fs from 'fs'
import stream from 'stream'
import { SVGIcons2SVGFontStream } from 'svgicons2svgfont'
import svg2ttf from 'svg2ttf'
import ttf2woff from 'ttf2woff'
import ttf2woff2 from 'ttf2woff2'

import type { ConvertSvgToFontFn } from './types'


const convertSvgToFont: ConvertSvgToFontFn = ({ fontName, svgs, isWoff2 }) => (
    new Promise<string>((resolve, reject) => {
        const fontStream = new SVGIcons2SVGFontStream({
            fontName,
            normalize: true,
            fontHeight: 1000
        })

        let svgFont = ''
        fontStream
            .on('data', part => { svgFont += part })
            .on('finish', () => { resolve(svgFont) })
            .on('error', reject)

        svgs.forEach((filename, i) => {
            const glyph = Object.assign(new stream.Readable(), {
                _read() {},
                metadata: {
                    unicode: [ String.fromCodePoint('\ue000'.charCodeAt(0) + i) ],
                    name: 'i' + i
                }
            })

            fontStream.write(glyph)

            fs.readFile(filename, (err, svgBuffer) => {
                if (err) return reject(err)

                // prevent svgs with fill="none" from being translated into an empty symbol
                const svgCode = `${svgBuffer}`.replace(/\sfill\s*=\s*["']?none['"]?/ig, '')
                glyph.push(svgCode)
                glyph.push(null)
            })
        })

        fontStream.end()
    }))
    .then(svgFont => svg2ttf(svgFont, { ts: 0 }).buffer)
    .then(ttfFont => isWoff2 ? ttf2woff2(ttfFont as Buffer) : ttf2woff(ttfFont).buffer)


export default convertSvgToFont