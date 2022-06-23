## Clone

Clones any object

<br />

Receives **1** argument:
- **object** - **Object**. Object to clone

<br />

```js
import clone from 'siegel-ui-utils/deep/clone'

const someObject = {
    someProp: 22,
    anotherProp: {
        someProp: 22,
        someArray: [1,2,3]
    }
}

const clonnedObject = clone(someObject)
```