# Custom hooks

<br />

## useDidUpdate

<br />

Checks whether some props have been changed<br />
Receives **4** arguments:
- **cb** - **React.useLayoutEffect**'s first parameter (callback)
- **dependencies** - **React.useLayoutEffect**'s second parameter (dependencies)
- **onlyOnce** - Optional **Boolean**. Whether to trigger callback function only once
- **ref** - **React.useRef()**. If ypu already have an initialized ref - you may pass it to this hook

Exports **Symbol** used for inner ref mutation:
- **symbolIsRendered** - to indicate whether component has been already rendered at least once
- **symbolIsCalled** - to indicate whether callback function has been called at least once

<br />

``` js
import React from 'react'
import useDidUpdate, { symbolIsRendered, symbolIsCalled } from 'siegel/lib/client_core/hooks/did_update'


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
import usePrevious, { symbolPrevValue } from 'siegel/lib/client_core/hooks/previous'


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