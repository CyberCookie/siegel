# Server

Server could be runned in HTTP / HTTP2 mode with or without secure layer depending on a server configuration you passed<br />
Static server is already configured to serve brotli and gzip compressed files and always responses with index.html due to SPA<br />
So far HTTP(ExpressJS) and HTTP2(NodeJS module) are incompatible

<br/>

### Server exposes interface with the only method named **run**:

Receives **3** parameters:
- **config** - Siegel config
- **middlewares** - **Array of expressMiddleware** - ExpressJS middlewares. Thus affects only http(s) server
- **serverExtend** - resolved server extender

<br/>

### config

```js
{   
    /* Public directory */
    publicDir: String,

    server: {
        /*
            Path to a user defined server to extend the one created by siegel
            Server extender should be a function
            Function receives an instance of the server as a first paramenter
            and dependencies used to create this server along with internal server API as a second parameter
        */
        appServerLoc: String,

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
            You may pass SSL params to establish secure connection (HTTPS HTTP2S)
            Use siegel's 'create_ssl' script to create localhost certificate
        */
        ssl: {
            /* Path to ssl private key. */
            keyPath: String,

            /* Path to signed certificate. */
            certPath: String
        },

        /*
            Compressed files lookup order
            If no compressed file is found - plain file will be returned 
            Default is: [ 'br, 'gzip' ]
        */
        compressionServingOrder: String[]
    }
}
```


<br /><br />

### serverExtend

<br />

```js
// siegel_config
{
    server: {
        appServerLoc: `${process.cwd()}/internal_server_extender.js`
    }
}
```


```js
// internal_server_extender.js

const { proxyReq } = (await import('../../src/index.js'))


function appServer(app, { express, onStream }) {
    if (onStream) { // if HTTP2
        onStream(() => {
            console.log('HTTP2 stream')
        })
    } else {
        app
            .use(express.json())

            .post('/api/some_post', ((req, res) => {
                res.send(req.body)
            }))
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
- `host` **String** - destination host
- `port` **Number** - destination port
- `path` **String** - url path. Default is original request url path
- `query` **String | Object** - url query params. Default is original request query params.<br />
    If **Object** provided then **Object** _key_ is query key and **Object** _value_ is query value
- `method` **String** - request method. Default is original request method
- `headers` **Object | Function** - request headers.<br />
    If **Object** provided then **Object** _key_ is header key and **Object** _value_ is header value. Given **Object** will be merged with **Request headers**<br />
    If **Function** provided then it has **1** argument:
        - **headers** - **Mutable request headers**. 
- `changeOrigin` - **Boolean** - could be helpful for CORS requests
- `postProcessReq` **Function** - Triggered before request to the next resource occurs. Has **2** arguments:
    - **client request** - **Object**. Request made by your client.
    - **options** - **Object**. Options that will be passed to request to make a request to. Has the next fields:
        - `host` - **String**. Host to make request to
        - `port` - **Number**. Port to make request to
        - `headers` - **Object**. Final headers to make request to
        - `method` - **String**. Method to make request to
        - `path` - **String**. Final path to make request to


<br /><hr />
<details>
    <summary>TODO</summary>
    - Compatible HTTP1 and HTTP2 static server<br />
    - SEO for crawlers (pages prebuild or build on the fly)<br />
    - Add more typings<br />
    - Isomorphic API?
</details>