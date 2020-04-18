import React from 'react'

import cx from '../../utils/cx'


const FilterBar = ({ filterData, selected, onSelect, disabled = false, isRadio = false, className = '', titleKey = '' }) => {
    let filterRow = filterData.map(dataItem => {
        let { id, title } = dataItem,
            isActive = isRadio ? selected == id : selected.includes(id);

        const onDatePick = () => {
            let value;
            if (isRadio) {
                value = id
            } else {
                value = [...selected]
                let index = selected.indexOf(id)

                index > -1 ? value.splice(index, 1) : value.push(id)
            }

            onSelect(value)
        }

        return (
            <div key={id} onMouseDown={onDatePick}
                className={cx('filter-btn', { active: isActive })}>
                {titleKey ? dataItem[titleKey] : title}
            </div>
        )
    })

    return (
        <div className={cx(`-ui-row-filter ${className}`, { disabled })}>
            {filterRow}
        </div>
    )
}

export default FilterBar