import mergeModuleRules from './merge.js'
import getDefaultModuleRules from './defaults.js'

import type { ConfigFinal, RunParamsFinal } from '../../types'


const merge = (CONFIG: ConfigFinal, RUN_PARAMS: RunParamsFinal) => mergeModuleRules(
    getDefaultModuleRules(CONFIG, RUN_PARAMS),
    CONFIG.build.module
)


export default merge