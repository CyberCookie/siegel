import type { MergedProps } from '../types'


type GetRangeElement = (
    key: string,
    className: string | undefined,
    width: number,
    isVertical: MergedProps['isVertical']
) => React.JSX.Element

type GetRangePickerElement = (
    key: string,
    props: MergedProps,
    width: number
) => React.JSX.Element


export type { GetRangeElement, GetRangePickerElement }