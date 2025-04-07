import mergeModuleRules from './merge.js'
import getDefaultModuleRules from './defaults.js'

import type { ConfigObject } from '../../types'


const merge = (config: ConfigObject) => mergeModuleRules(
    getDefaultModuleRules(config),
    config.build!.module
)


export default merge