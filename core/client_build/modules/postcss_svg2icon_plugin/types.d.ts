import type { Plugin, Root } from 'postcss'


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


type GetFontFaceNodeFn = (
    opts: {
        svgs: string[]
    } & Svg2FontConverterPluginOptions,
    handlers: {
        onFontName: (fontName: string) => any
        onFinish: (root: Root) => any
    }
) => Promise<void>


export type {
    Svg2FontConverterPlugin, Svg2FontConverterPluginOptions,
    GetFontFaceNodeFn, ConvertSvgToFontFn
}