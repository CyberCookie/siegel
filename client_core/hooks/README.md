<h1>Custom hooks</h1>

<br />
<h3>useDidUpdate</h3>
<br />

Checks whether some props have been changed.<br />
It has the same signature as useEffect / useLayoutEffect hooks.

``` js
import React from 'react'
import useDidUpdate from 'siegel-hooks/did_update'


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
<h3>usePrevious</h3>
<br />

Saves given value and returns it on the next render.<br />
Returns undefined on the first render.<br />

<h4>Signature:</h4>

<ul>usePrevious(value, reusableRef?, key?)
    <li><b>value</b> - value to save</li>
    <li>
        <b>reusableRef</b> - If ypu already have an initialized ref - you may pass it to this hook<br />
    </li>
    <li><b>key</b> - key to store a value in ref object. default is <i>_prevValue</i></li>
</ul>

``` js
import React, { useRef } from 'react'
import usePrevious from 'siegel-hooks/previous'


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