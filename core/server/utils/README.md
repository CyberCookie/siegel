<h1>Utils</h1>

<br/>
<h3>These utils where made to save some backward compatibility with common js node</h3>



<br/>
<h3>Require json</h3>
Returns parsed JSON by json file pathname<br /> 
<br/>

```ts
import { utils } from 'siegel'

const parsed = utils.requireJSON('path/to/file.json')
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


<br/>
<h3>Proxy request</h3>
Siegel provides method to proxy server requests<br /> 
<br/>

```ts
// siegel_server_extend.ts
import { proxyReq, ServerExtenderFn, FastifyHTTPServer } from '../../core'

const appServer: ServerExtenderFn = server => {

    ;(server as FastifyHTTPServer)
        .get('/api/proxy_get/:id', proxyReq({
            host: 'jsonplaceholder.typicode.com',
            path: '/todos/:id',
            changeOrigin: true
        }))
}

export default appServer

// ...exoress code
app.get('/api/proxy_get/:id', apiProxy)
// exoress code...
```

Proxy receives **1** parameter - **Object** with the next fields:
- `secure` **Boolean** - makes requests over https
- `ws` **Boolean** - Enables web socket proxying
- `wsEndpoints` **Array<string>** - You should specify ws connection endpoints for this destination<br />
     if you proxy to multiple backends using the same fastify server
- `host` **String** - destination host
- `port` **Number** - destination port
- `path` **String** - Rewrites origin path [doesn't affect web socket subscription]
- `query` **Object** - Rewrites origin query params
- `changeOrigin` - **Boolean** - Replaces origin host header with target host
- `postProcessReq` **Function** - Called after proxy request options is formed<br />
giving you full controll over the proxy request options<br />
    Has **2** arguments:
    - **client request** - **Request | IncomingMessage**. Request from origin
    - **options** - **RequestOptions**. Mutable proxy request options