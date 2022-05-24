import React, { useState } from 'react'

import { Input, Button } from 'app/components'

import styles from './styles.sass'


const Basename = () => {
    const [ basename, setBasename ] = useState('')

    return (
        <div>
            <Input label='New basename' value={ basename }
                onChange={ newBasename => {
                    setBasename(newBasename)
                } } />

            <Button className={ styles.apply_basename_btn } value='Apply basename'
                onClick={ () => {
                    history.updateBasename!(basename)
                } } />
        </div>
    )
}


export default Basename