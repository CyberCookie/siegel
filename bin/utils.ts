import path from 'path'

import { PATHS } from '../core/constants.js'


const getColored = (color: number, str: string) => `\x1b[${color}m${str}\x1b[0m`

const getColoredCommandStr = getColored.bind(null, 36)
const getColoredCommandArgumentStr = getColored.bind(null, 32)
const getColoredHighlightText = getColored.bind(null, 33)


const resolvePath = (_path: string) => path.isAbsolute(_path) ? _path : `${PATHS.CWD}/${_path}`


export {
    resolvePath, getColored,
    getColoredCommandStr, getColoredCommandArgumentStr, getColoredHighlightText
}