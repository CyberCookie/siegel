import mergeModules from './merge.js'
import getDefaultModules from './defaults.js'

import type { ConfigFinal, RunParamsFinal } from '../../types'


const merge = (CONFIG: ConfigFinal, RUN_PARAMS: RunParamsFinal) => mergeModules(
    getDefaultModules(CONFIG, RUN_PARAMS),
    CONFIG.build.modules
)


export default merge