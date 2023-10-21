# Server

Server could be runned in `HTTP1` / `HTTP2` mode with or without secure layer depending on a server configuration you passed.<br />
Static server is already configured to serve brotli and gzip compressed files and always responses with index.html as a SPA application.<br />
Only `HTTP1` is suitable for development purposes<br />

<br/><br/>


### Server returns an object with the only method `run`:

Receives **3** parameters:
- **config** - Siegel config
- **middlewares** - **ExpressMiddleware[]** - ExpressJS middlewares. Thus affects only http(s) server
- **serverExtend** - function to extend this server

<br/>

## config

```js
{   
    /* Public directory */
    publicDir: String,

    server: {
        /* User defined server to extend the one created by Siegel */
        appServer: Function,

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

        /* Whether to use HTTP2 protocol */
        http2: Boolean,

        /*
            SSL params to establish secure connection (HTTPS HTTP2S)
            Use siegel's 'create_ssl' script to create localhost certificate
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
    }
}
```



<br /><br />

## Extend with own server

To extend built in server you may use `server.appServer` config property 

<br />

```js
import myServer from './my_server.ts'


// ...siegel_config
{
    server: {
        appServer: myServer
    }
}
```

Here we define path to User App entrypoint file - **user_app.ts**<br />
User App must be a **Function** in order to call it during Siegel server initialization<br />
The **Function**, both for HTTP1 and HTTP2 receives almost the same **2**** arguments:
- **Static server data** - **Object**. Static server protocol related data<br />
    - `HTTP1` static server made with `Express` has the next fields:
        - `express` - **Express module**
        - `staticServer` - **express()**. Static server created with express
    - `HTTP2` static server made with `http2` node module, has the next fields:
        - `onStream` - **Function** with the only argument
            - **http2.ServerHttp2Stream**.<br />
            Return `true` to prevent further request processing
        - `staticServer` - Static server created with `http2` module
- **siegel config** - Siegel config

The User App function is called right before static server features was applied.<br />
Static server caches resources by resource name, so you should always add hash to static files at build stage.<br />
To prevent file from caching - just add `cache-control: no-cache` header to request.<br />
Resources thats will be cached, response with `cache-control: max-age=31536000, immutable` header


```js
// user_app.js
function appServer({ express, staticServer, onStream }, CONFIG) {
    if (express) {
        staticServer
            .use(express.json())

            .post('/api/echo', ((req, res, next, err) => {
                res.send(req.body)
            }))

    } else if (onStream) {
        onStream((stream, headers, flags) => {
            return true // prevent further processing
        })
    }
}

export default appServer
```


<br /><br />

## Proxy request

<br/>

Siegel provides method to proxy server requests:

```js
import express from 'express'
import { proxyReq } from 'siegel'


const app = express()

const apiProxy = proxyReq({
    host: 'jsonplaceholder.typicode.com',
    path: '/todos/:id',
    changeOrigin: true
})

// ...exoress code
app.get('/api/proxy_get/:id', apiProxy)
// exoress code...
```


Proxy receives **1** parameter - **Object** with the next fields:
- `secure` **Boolean** - makes requests over https
- `host` **String** - destination host
- `port` **Number** - destination port
- `path` **String** - URL path. Default is original request URL path
- `query` **Object** - URL query params. Default is original request query params<br />
    If **Object** provided then **Object** _key_ is query key and **Object** _value_ is **String** query value
- `method` **String** - request method. Default is original request method
- `headers` **Object | Function** - request headers<br />
    If **Object** provided then **Object** _key_ is header key and **Object** _value_ is header value. Given **Object** will be merged with **Request headers**<br />
    If **Function** provided then it has **1** argument:
        - **headers** - **Mutable request headers**
- `changeOrigin` - **Boolean** - could be helpful for CORS requests
- `postProcessReq` **Function** - Triggered before request to the next resource occurs. Has **2** arguments:
    - **client request** - **Object**. Request made by your client
    - **options** - **Object**. Options that was passed to request to make a request to. Has the next fields:
        - `host` - **String**. Host to make request to
        - `port` - **Number**. Port to make request to
        - `headers` - **Object**. Final headers to make request to
        - `method` - **String**. Method to make request to
        - `path` - **String**. Final path to make request to


<br /><hr />
<details>
    <summary>TODO</summary>
    - Compatible HTTP1 and HTTP2 static servers<br />
    - SEO for crawlers (pages prebuild or build on the fly)<br />
    - Protobuf
</details>