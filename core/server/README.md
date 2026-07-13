# Server

Server could be runned in `HTTP1.1` / `HTTP/2` mode with or without secure layer depending on a server config you passed.<br />
Static server is already configured to serve brotli and gzip compressed files and always responses with index.html as a SPA application.<br />
Only `HTTP1.1` is suitable for development purposes<br />

<br/><br/>


### Server returns an object with the only method `run`:

Receives **2** parameters:
- **config** - Siegel config
- **devMiddlewares** - **Object** - Webpack dev middlewares
    - `dev` - webpack dev middleware
    - `hot` - webpack hot middleware
    - `indexFallback` - webpack dev middleware index fallback

<br/>

## config

```ts

type AppServer = (
    params: {
        staticServer: FastifyHTTPServer | FastifyHTTPServerSecure | FastifyHTTP2Server | FastifyHTTP2ServerSecure,
        siegelConfig: ConfigObject
        fastify: typeof import('fastify')
    }
) => Promise<void> | void


type StaticServingData = {
    pathToFile: string
    encoding: string
    cacheControl: string
    contentType: ReturnType<Mime['getType']>
}


{   
    /* Public directory */
    publicDir: String,

    server: {
        /* User defined server to extend the one created by Siegel */
        appServer: AppServer,

        /*
            Static server host
            Default is: 'localhost'
        */
        host: String,

        /*
            Static server port
            Default is: 3000
        */
        port: Number,

        /* Whether to use HTTP/2 protocol */
        http2: Boolean,

        /*
            SSL params to establish secure connection (HTTPS HTTP/2(S))
            Use Siegel's 'create_ssl' script to create localhost certificate
        */
        ssl: {
            /* Path to ssl private key */
            keyPath: String,

            /* Path to signed certificate */
            certPath: String
        },

        /*
            Compressed files lookup order
            If no compressed file is found - plain file that was returned 
            Default is: [ 'br, 'gzip' ]
        */
        serveCompressionsPriority: String[]

        /*
            Custom handler when resource is requested
            Return false to prevent default behaviour
        */
        handleResourceRequest(
            req: FastifyRequest,
            res: FastifyReply
        ): boolean
    }
}
```



<br /><br />

## Extend with own server

To extend built in server you may use `server.appServer` config property 

<br />

```ts
import myServer from './my_server.ts'


// ...Siegel_config
{
    server: {
        appServer: myServer
    }
}
```

Here we define path to User App entrypoint file - **user_app.ts**<br />
User App must be a **Function** in order to call it during Siegel server initialization<br />
The **Function** has **3** parameters:
- **Static server** - **FastifyStaticServer**. Fastify static server. `HTTP\S` or `HTTP/2\S`
- **Siegel config** - Siegel config
- **fastify**: **Fastify** 

The User App function is called right before static server features was applied.<br />
Static server caches resources by resource name, so you should always add hash to static files at build stage.<br />
To prevent file from caching - just add `cache-control: no-cache` header to request.<br />
Resources thats will be cached, response with `cache-control: max-age=31536000, immutable` header


```ts
// siegel_server_extend.ts
import type { ServerExtenderFn, FastifyHTTPServer } from 'siegel'
import type { FastifyRequest } from 'fastify'
import type { EchoReqBody } from '../dto/demo_api'

const appServer: ServerExtenderFn = server => {

    ;(server as FastifyHTTPServer)
        .post('/api/echo', (req: FastifyRequest<{ Body: EchoReqBody }>, res) => {
            res.send(req.body)
        })
}

export default appServer
```


<br /><br />

## Proxy request

<br/>

Siegel provides method to proxy server requests:

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


<br /><hr />
<details>
    <summary>TODO</summary>
    - Compatible HTTP1.1 and HTTP/2 static servers<br />
    - SEO for crawlers (pages prebuild or build on the fly)<br />
    - Protobuf
</details>