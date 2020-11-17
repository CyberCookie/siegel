const path              = require('path')
const Svgicons2svgfont  = require('svgicons2svgfont')
const svg2ttf           = require('svg2ttf')
const ttf2woff          = require('ttf2woff')
const ttf2woff2         = require('ttf2woff2')
const Readable          = require('stream').Readable;


module.exports = function createIconFont(fs, icons, options) {
    icons = icons.map(iconPath => path.resolve('.', iconPath))

    return new Promise((resolve, reject) => {
        const fontStream = new Svgicons2svgfont({
            name: options.name,
            normalize: true,
            fontHeight: 1000,
            error: reject
        })
        
        let svgFont = ''
        fontStream
            .on('finish', () => { resolve(svgFont) })
            .on('data', part => { svgFont += part })
            .on('error', reject)

        icons.forEach((filename, i) => {
            const glyph = Object.assign(new Readable(), {
                // eslint-disable-next-line
                _read() {},
                metadata: {
                    unicode: [ String.fromCodePoint('\ue000'.charCodeAt(0) + i) ],
                    name: 'i' + i
                }
            })

            fontStream.write(glyph)

            fs.readFile(filename, (err, svgBuffer) => {
                if (err) return reject(err)

                // prevent svgs with fill="none" from beeing translated into an empty symbol
                const svgCode = svgBuffer.toString().replace(/\sfill\s*=\s*["']?none['"]?/ig, '')
                glyph.push(svgCode)
                glyph.push(null)
            })
        })
        fontStream.end()
    })
        .then(svgFont => svg2ttf(svgFont, {}).buffer)
        .then(ttfFont => (
            options.woff2
                ?   ttf2woff2(ttfFont)
                :   ttf2woff(ttfFont).buffer
        )
        ).then(font => Buffer.from(font).toString('base64'))
}