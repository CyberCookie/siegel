import type { Plugin } from 'postcss'


type Svg2FontConverterPluginOptions = {
    fontNamePrefix?: string
    isWoff2?: boolean
}

type Svg2FontConverterPlugin = (options: Svg2FontConverterPluginOptions) => Plugin


type ConvertSvgToFontFn = (params: {
    fontName: string
    svgs: string[]
    isWoff2: boolean | undefined
}) => Promise<ArrayBuffer>


export type { Svg2FontConverterPlugin, ConvertSvgToFontFn }