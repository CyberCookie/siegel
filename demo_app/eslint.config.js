//// @ts-check

import siegelEslintConfig from '../eslint.config.js'
import {
    config as typeScriptEslintCreateConfig
} from 'typescript-eslint'


const config = typeScriptEslintCreateConfig(
    {
        extends: [ ...siegelEslintConfig ]
    }
)


export default config