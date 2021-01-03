# Server
Server could be runned in HTTP / HTTP2 mode with or without secure layer depending on a server configuration you passed.
Static server is already configured to serve brotli and gzip compressed files and always responses with index.html due to SPA.
So far HTTP(ExpressJS) and HTTP2(NodeJS module) are incompatible.

### Server exposes interface with the only method:
### run(config, middlewares?, serverExtend?)
<ul>
    <li><b>config</b> - siegel config</li>
    <li><b>middlewares</b> - ExpressJS middlewares. Thus affects only http(s) server. By default siegel passes webpack hot and dev middlewares.</li>
    <li><b>serverExtend</b> - resolved server extender</li>
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
            Function receives an instance of the server as a first paramenter and dependencies used to create this server as a second.
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

<br /><hr />
<details>
    <summary><h5>TODO</h5></summary>
    <ul>
        <li>Compatible HTTP1 and HTTP2 static server</li>
        <li>SEO for crawlers (pages prebuild or build on the fly)</li>
        <li>Clear 'any' from TS files</li>
        <li>Isomorphic API</li>
        <li>Implement webSocket abstraction?</li>
    </ul>
</details>