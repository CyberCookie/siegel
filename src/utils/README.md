<h1>Utils</h1>

<br/>
<h3>These utils where made to save some backward compatibility with common js node</h3>


<br/>
<h3>CJS __dirname</h3>
Retrieves dirname in CommonJS manner.<br />
It accessible through global variable <b>__dirname</b> in CommonJS.
<br/>

```js
import { utils } from 'siegel'

const __dirname = utils.cjs__dirname(import.meta)
```

<br/>
<h3>is run directly</h3>
Returns true if module were run directly from CLI.<br />
In CommonJS were made with <b>require.main == module</b> check.
<br/>

```js
import { utils } from 'siegel'

utils.isRunDirectly(import.meta)
```

<br/>
<h3>Require json</h3>
Returns parsed JSON by json file pathname.<br /> 
<br/>

```js
import { utils } from 'siegel'

const parsed = utils.requireJSON('path/to/file.json')
```