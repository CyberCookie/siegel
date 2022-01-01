<h1>Server</h1>
Server could be runned in HTTP / HTTP2 mode with or without secure layer depending on a server configuration you passed.
Static server is already configured to serve brotli and gzip compressed files and always responses with index.html due to SPA.
So far HTTP(ExpressJS) and HTTP2(NodeJS module) are incompatible.

<br/>
<h3>Server exposes interface with the only method:</h3>

<ul>
    run(config, middlewares?, serverExtend?)
    <li><b>config</b> - siegel config.</li>
    <li><b>middlewares</b> - <b>expressMiddleware[]</b> - ExpressJS middlewares. Thus affects only http(s) server.<br />
    By default siegel passes webpack hot and dev middlewares.</li>
    <li><b>serverExtend</b> - resolved server extender.</li>
</ul>
<br />

<h3>config</h3>

```js
{   
    /* Public directory */
    staticDir: String,

    server: {
        /*
            Path to a user defined server to extend the one created by siegel.
            Server extender should be a function.
            Function receives an instance of the server as a first paramenter
            and dependencies used to create this server along with internal server API as a second parameter.
        */
        appServerLoc: String,

        /* Reload when some changes in user server occur. */
        watch: Boolean,

        /*
            Static server host.
            Default is: 'localhost'
        */
        host: String,

        /*
            Static server port.
            Default is: 3000
        */
        port: Number,

        /* Whether to use HTTP2 protocol. */
        http2: Boolean,

        /*
            You may pass SSL params to establish secure connection (HTTPS HTTP2S).
            Use siegel's 'create_ssl' script to create localhost certificate.
        */
        ssl: {
            /* Path to ssl private key. */
            keyPath: String,

            /* Path to signed certificate. */
            certPath: String
        }
    }
}
```


<br />
<h3>serverExtend</h3>

<br />
siegel_config
<br />

```ts
{
    server: {
        appServerLoc: path.join(__dirname, 'internal_server_extender.ts')
    }
}
```

<br />
internal_server_extender.ts
<br />

```ts
import type { Http2Server, Http2SecureServer, ServerHttp2Stream, IncomingHttpHeaders } from 'node:http2'
import type { Application, Express } from 'express'


type App = Application | Http2Server | Http2SecureServer

type InternalAPI = {
    express?: Express
    onStream?: (
        cb: (stream: ServerHttp2Stream, headers: IncomingHttpHeaders, flags: number) => void
    ) => void
}


module.exports = (app: App, { express, onStream }: InternalAPI) => {
    if (onStream) { // if HTTP2
        onStream(() => {
            console.log('HTTP2 stream')
        })

    } else {
        (app as Application)
            .use(express.json())

            .post('/api/some_post', ((req, res) => {
                res.send(req.body)
            }))
    }
}

```



<br />
<h2>Proxy request</h2>
<br/>

Siegel provides method to proxy server requests:

```js
const app = require('express')()
const proxy = require('siegel').proxyReq


const apiProxy = proxy({
    host: 'jsonplaceholder.typicode.com',
    path: '/todos/:id',
    changeOrigin: true
})

// ...exoress code
app.get('/api/proxy_get/:id', apiProxy)
// exoress code...
```

<ul>
    Proxy signature:
    <li>
        <b>proxy params - object</b>
        <ul>
            <li><b>host</b> - destination host.</li>
            <li><b>port</b> - destination port.</li>
            <li><b>path</b> - url path. Default is original request url path.</li>
            <li><b>query</b> - url query params. Default is original request query params.</li>
            <li><b>method</b> - request method. Default is original request method.</li>
            <li>
                <b>headers</b> - request headers. Could be a function which retrieves original request headers<br/>
                and returns final headers.
            </li>
            <li><b>changeOrigin</b> - (Boolean) - could be helpful for CORS requests.</li>
            <li>
                <b>postProcessReq</b> - function that retrieves original request as first argument<br />
                and mutable final proxy request options as second.
        </ul>
    </li>
</ul>



<br /><hr />
<details>
    <summary><h5>TODO</h5></summary>
    <ul>
        <li>Compatible HTTP1 and HTTP2 static server</li>
        <li>SEO for crawlers (pages prebuild or build on the fly)</li>
        <li>Add more typings</li>
        <li>Isomorphic API?</li>
    </ul>
</details>