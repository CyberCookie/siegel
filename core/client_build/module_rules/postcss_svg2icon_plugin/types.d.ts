import type { Plugin, Root } from 'postcss'


type Svg2FontConverterPluginOptions = {
    iconsRoot: string
    fontNamePrefix?: string
}

type Svg2FontConverterPlugin = (options: Svg2FontConverterPluginOptions) => Plugin

type ConvertSvgToFontFn = (params: {
    fontName: string
    svgs: string[]
}) => Promise<ArrayBuffer | SharedArrayBuffer | Buffer>


type GetFontFaceNodeFn = (
    opts: {
        svgs: string[]
        fontNamePrefix: Svg2FontConverterPluginOptions['fontNamePrefix']
    },
    handlers: {
        onFontName(fontName: string): void
        onFinish(root: Root): void
    }
) => Promise<void>


export type {
    Svg2FontConverterPlugin, Svg2FontConverterPluginOptions,
    GetFontFaceNodeFn, ConvertSvgToFontFn
}