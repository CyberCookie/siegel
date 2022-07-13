import mergePlugins from './merge.js'
import getDefaultPlugins from './defaults.js'

import type { ConfigFinal, RunParamsFinal } from '../../types'


const merge = (CONFIG: ConfigFinal, RUN_PARAMS: RunParamsFinal) => mergePlugins(
    getDefaultPlugins(CONFIG, RUN_PARAMS),
    CONFIG.build.plugins
)


export default merge