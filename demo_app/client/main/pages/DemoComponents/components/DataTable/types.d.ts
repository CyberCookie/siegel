import type { Entities } from 'siegel-ui-utils/entities_struct'

import type { DataTableProps } from 'app/components'


type Entity = {
    id: ID
    date: number
    text: string
    num: number
    bool: boolean
}

type MockEntities = Entities<Entity>

type ColumnCustomParams = {
    type: 'set' | 'text' | 'date'
    valuePath: keyof Entity
    className: string
}

type DemoDataTableProps = DataTableProps<MockEntities, ColumnCustomParams>


export type { Entity, MockEntities, DemoDataTableProps }