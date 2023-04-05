import type { DataTableProps } from 'app/components'


type Entity = {
    id: string
    date: number
    text: string
    num: number
    bool: boolean
}

type ColumnCustomParams = {
    type: 'set' | 'text' | 'date'
    valuePath: keyof Entity
    className: string
}

type DemoDataTableProps = DataTableProps<Entity, ColumnCustomParams>


export type { Entity, DemoDataTableProps }