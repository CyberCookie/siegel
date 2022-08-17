## memo

Executes callback to memoize result and returns it whenever called until dependencies have changd<br />

Receives **3** parameters:<br />
- callback - **Function** result to memoize<br />
- dependencyValue - **String | Number | Boolean**. Value to compare with one from previous callback execution<br />
    in order to determine whether to return memoized value<br />
- id - **Number**. Memoization ID <br />
Returns **Any** - memoized result<br />

You may import `getUniqID` to generate uniq ID to use in memoization function.<br />
To prevent memory leaks use `clearState` that accepts memoization id.


<br />

```js
import memo, { getUniqID, clearState } from 'siegel-utils/memo'


const expensiveCalculationID = getUniqID()

const expensiveCalculaton = () => {
    ///expensive calculations
    return true
}

// performs calculations first time
let result = memo(
    expensiveCalculaton,
    'string as dependency',
    expensiveCalculationID
)

// returns previous calculations since dependencies haven't changed
result = memo(
    expensiveCalculaton,
    'string as dependency',
    expensiveCalculationID
)

// performs new calculations since dependencies have changed
result = memo(
    expensiveCalculaton,
    'new dependency',
    expensiveCalculationID
)


// Clear state
clearState(expensiveCalculationID)
```