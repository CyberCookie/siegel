import mergePlugins from './merge.js'
import getDefaultPlugins from './defaults.js'


const merge = (CONFIG, RUN_PARAMS) => mergePlugins(
    getDefaultPlugins(CONFIG, RUN_PARAMS),
    CONFIG.build.plugins
)


export default merge