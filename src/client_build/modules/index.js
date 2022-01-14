import mergeModules from './merge.js'
import getDefaultModules from './defaults.js'


const merge = (CONFIG, RUN_PARAMS) => mergeModules(
    getDefaultModules(CONFIG, RUN_PARAMS),
    CONFIG.build.modules
)


export default merge