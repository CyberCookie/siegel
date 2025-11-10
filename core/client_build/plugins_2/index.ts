import mergePlugins from './merge.js'
import getDefaultPlugins from './defaults.js'

import type { ConfigObject } from '../../types'


const merge = (config: ConfigObject) => mergePlugins(
    getDefaultPlugins(config) as any,
    config.build!.plugins
)


export default merge