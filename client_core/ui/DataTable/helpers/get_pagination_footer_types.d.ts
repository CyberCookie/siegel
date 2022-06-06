import type { MergedProps } from '../types'


type GetPaginationFnProps = {
    withFooter: NonNullable<MergedProps['withFooter']>
} & MergedProps


export type { GetPaginationFnProps }