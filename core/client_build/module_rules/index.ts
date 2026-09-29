import mergeModuleRules from './merge'
import getDefaultModuleRules from './defaults'

import type { ConfigObject } from '../../types'


const merge = (config: ConfigObject) => mergeModuleRules(
    getDefaultModuleRules(config),
    config.build!.module
)


export default merge