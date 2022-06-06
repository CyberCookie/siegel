import type { MergedProps } from '../types'


type GetRangeElement = (key: string, className: string, width: number) => JSX.Element

type GetRangePickerElement = (key: string, props: MergedProps, width: number) => JSX.Element


export type { GetRangeElement, GetRangePickerElement }