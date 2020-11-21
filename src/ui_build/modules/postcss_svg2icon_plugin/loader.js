const loaderUtils = require('loader-utils')

const createIconFont = require('./icons_to_font.js')


module.exports = function() {
    this.cacheable && this.cacheable()

    const callback = this.async()
    
    // WTF?
    const query = loaderUtils.parseQuery(this.query)
    // Add svgs to webpack file watching:
    query.svgs.forEach(svg => this.addDependency(svg))

    createIconFont(query)
        .then(
            result => {
                const font = Buffer.from(result).toString('base64')
                // Return the font to webpack
                const url = '"data:application/x-font-woff;charset=utf-8;base64,' + font + '"'
                callback(null, 'module.exports=' + JSON.stringify(url) + ';')
            },
            callback
        )
}