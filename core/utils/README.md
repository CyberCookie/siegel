<h1>Utils</h1>

<br/>
<h3>These utils where made to save some backward compatibility with common js node</h3>


<br/>
<h3>CJS __dirname</h3>
Retrieves dirname in CommonJS manner<br />
It accessible through global variable **__dirname** in CommonJS.
<br/>

```ts
import { utils } from 'siegel'

const __dirname = utils.cjs__dirname(import.meta)
```

<br/>
<h3>is run directly</h3>
Returns true if module were run directly from CLI<br />
In CommonJS were made with **require.main == module** check.
<br/>

```ts
import { utils } from 'siegel'

utils.isRunDirectly(import.meta)
```

<br/>
<h3>Require json</h3>
Returns parsed JSON by json file pathname<br /> 
<br/>

```ts
import { utils } from 'siegel'

const parsed = utils.requireJSON('path/to/file.json')
```

<br/>
<h3>Global node modules path</h3>
Returns location where global node modules are stored<br /> 
<br/>

```ts
import { utils } from 'siegel'

const parsed = utils.globalNodeModulesPath()
// /home/user/.npm-packages/lib/node_modules
```

<br/>
<h3>To posix path</h3>
Converts any OS path to posix path<br /> 
<br/>

```ts
import { utils } from 'siegel'

const posixPath = utils.toPosixPath('some\\directory\\path')
// 'some/directory/path'
```

<br/>
<h3>Parse CLI args</h3>
Returns parsed JSON by json file pathname<br /> 
<br/>

```ts
import { utils } from 'siegel'

const CLI_ARGS = process.argv.slice(3)
/*
    Strip first 3 args (bin/node, filename, command) to get the next result:
    [ 'command_value', '-xyz', '--long-flag', '-w', '--value', 'value_1', '-q', 'value_2' ]
*/

const parsed = utils.parseCommandLineArgs(CLI_ARGS)
/*
    {
        commandValue: 'command_value',
        unresolvedParamsCount: 7,
        CLIParamsValues: {
            '-x': { value: true, resolved: false },
            '-y': { value: true, resolved: false },
            '-z': { value: true, resolved: false },
            '--long-flag': { value: true, resolved: false },
            '-w': { value: true, resolved: false },
            '--value': { value: 'value_1', resolved: false },
            '-q': { value: 'value_2', resolved: false }
        }
    }
*/
```

You can mutate CLIParamsValues `resolved` and `unresolvedParamsCount` fields<br />
while processing the result to perform some validation.


<br/>
<h3>TS to Webpack aliases</h3>
Transforms TS compilation paths to webpack aliases<br /> 
<br/>

```ts
import { utils } from 'siegel'

/*
    Lets say we have tsconfig.json at the root level with the next content:

    {
        ...
        "compilerOptions": {
            "paths": {
                "path_a/*": [ "./path_to_a/*" ],
                "path_b/*": [ "path/to/b/*" ],
                "path_c/*": [ "path_to_c/*" ],
                "path_d/*": [ "../path_to_d/*" ]
            }
        }
        ...
}
*/

const webpackAliases = utils.tsToWebpackAliases(pathToTSConfigDir)

/*
    in this case webpackAliases will be:

    {
        path_a: "/absolute_path/project/path_to_a",
        path_b: "/absolute_path/project/path/to/b",
        path_c: "/absolute_path/project/path_to_c",
        path_d: "/absolute_path/path_to_d",
    }
*/

```