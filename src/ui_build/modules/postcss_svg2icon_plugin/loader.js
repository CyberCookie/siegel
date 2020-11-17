const loaderUtils = require('loader-utils')
const path = require('path')

const createIconFont = require('./icons_to_font.js')


module.exports = function() {
    this.cacheable && this.cacheable()

    const callback = this.async()
    
    // WTF?
    const query = loaderUtils.parseQuery(this.query)

    // Add svgs to webpack file watching:
    query.svgs.forEach(svg => this.addDependency(path.resolve(svg)))

    createIconFont(this._compiler.inputFileSystem, query.svgs, query)
        .then(
            result => {
                // Return the font to webpack
                const url = '"data:application/x-font-woff;charset=utf-8;base64,' + result + '"'
                callback(null, 'module.exports=' + JSON.stringify(url) + ';')
            },
            err => {
                // In case of an svg generation error return an invalid font and throw an error
                const url = '"data:application/x-font-woff;charset=utf-8;base64,"'
                err.message += ' - Tried to compile: ' + JSON.stringify(query.svgs, null, 2)
                callback(new Error(err), 'module.exports=' + JSON.stringify(url) + ';')
            }
        )
}