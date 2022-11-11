## Clone

Clones any object

<br />

Receives **2** arguments:
- **value** - **Any**. Value to clone
- **Options** - **Object** with the next fields:
    - `funcClone` - **Function**. Custum function to clone functions.<br />
    Default behavior is simply assigning old one value

<br />

```js
import clone from 'siegel/lib/common/deep/clone'

const someObject = {
    someProp: 22,
    anotherProp: {
        someProp: 22,
        someArray: [1,2,3]
    }
}

const clonnedObject = clone(someObject)
```