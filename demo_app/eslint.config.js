//// @ts-check

import siegelEslintConfig from '../eslint.config'
import {
    config as typeScriptEslintCreateConfig
} from 'typescript-eslint'


const config = typeScriptEslintCreateConfig(
    {
        extends: [ ...siegelEslintConfig ]
    }
)


export default config