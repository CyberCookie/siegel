import React from 'react'

import './styles'


class NumberPicker extends React.Component {
    onInputChange = e => {
        if (!this.props.inputDisabled && (!e.nativeEvent.data || (/\d|\./).test(e.nativeEvent.data))) {
            this.onNumberPickerChange(e.target.value)
        }
    }

    onNumberPickerChange = value => {
        this.props.onChange({ 
            value,
            previousValue: this.props.value,
            ...this.props.onChangeParams
        })
    }

    onBlur = e => {
        e.persist()
        this.onNumberPickerChange( parseFloat(e.target.value) || 0 )
    }

    render() {
        let { value, prefix, sufix, inputDisabled } = this.props;
        let numberValue = parseFloat(value) || 0;
        let stringValue = value[0] === '0' && value[1] !== '.' 
        ?   value.slice(1, value.length) 
        :   value;

        return (
            <div className='-ui-number-picker'>
                <button className='minus' disabled={numberValue <= 0} 
                    onClick={() => this.onNumberPickerChange(numberValue - 1)}>−</button>

                <label data-prefix={prefix} data-sufix={sufix}>
                    <input disabled={inputDisabled} value={String(stringValue).substr(0, 4)}
                        onChange={this.onInputChange} 
                        onBlur={this.onBlur} />
                </label>

                <button className='plus' disabled={numberValue >= 100} 
                    onClick={() => this.onNumberPickerChange(numberValue + 1)}>+</button>
            </div>
        );
    }
}

export default NumberPicker