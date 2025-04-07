import mergePlugins from './merge.js'
import getDefaultPlugins from './defaults.js'

import type { ConfigObject } from '../../types'


const merge = (config: ConfigObject) => mergePlugins(
    getDefaultPlugins(config),
    config.build!.plugins
)


export default merge