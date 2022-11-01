# Custom hooks

<br />

## useDidUpdate

<br />

Checks whether some props have been changed<br />
It has the same signature as **React.useEffect** hook<br />
Exports **Symbol** used for inner ref mutation  

``` js
import React from 'react'
import useDidUpdate, { symbolIsRendered } from 'siegel-hooks/did_update'


const Component = props => {
    useDidUpdate(() => {
        console.log('props have been updated')

        return () => {
            console.log('component will unmount')
        }
    }, [ props.propToWatch1, props.propToWatch2 ])
    ...
}
```


<br /><br />

## usePrevious

<br />

Saves given value and returns it on the next render<br />
Returns undefined on the first render<br />

Receives **3** arguments:
- **value** - **Required** **Any**. Value to save
- **reusableRef** - **React.useRef()**. If ypu already have an initialized ref - you may pass it to this hook
- **key** - **String**. Key to store a value in ref the provided **reusableRef**

Exports **Symbol** used for inner ref mutation  

<br />

``` js
import React, { useRef } from 'react'
import usePrevious, { symbolPrevValue } from 'siegel-hooks/previous'


const Component = props => {
    if (props.someValue !== usePrevious(props.someValue)) {
        console.log('someValue has changed')
    }


    const reusableRef = useRef()

    const prevValue_1 = usePrevious(props.someValue_1, reusableRef, 'key_one')
    const prevValue_2 = usePrevious(props.someValue_2, reusableRef, 'key_two')
    //...
}
```