import type { Plugin, Root } from 'postcss'


type Svg2FontConverterPluginOptions = {
    iconsRoot: string
    fontNamePrefix?: string
    isWoff2?: boolean
}

type Svg2FontConverterPlugin = (options: Svg2FontConverterPluginOptions) => Plugin

type ConvertSvgToFontFn = (params: {
    fontName: string
    svgs: string[]
    isWoff2: boolean | undefined
}) => Promise<ArrayBuffer>


type GetFontFaceNodeFn = (
    opts: {
        svgs: string[]
        fontNamePrefix: Svg2FontConverterPluginOptions['fontNamePrefix']
        isWoff2: Svg2FontConverterPluginOptions['isWoff2']
    },
    handlers: {
        onFontName: (fontName: string) => void
        onFinish: (root: Root) => void
    }
) => Promise<void>


export type {
    Svg2FontConverterPlugin, Svg2FontConverterPluginOptions,
    GetFontFaceNodeFn, ConvertSvgToFontFn
}