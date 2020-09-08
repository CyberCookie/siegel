# Server
Server could be runned in HTTP / HTTP2 mode with or without secure layer depending on a server configuration you passed.
Static server is already configured to serve brotli and gzip compressed files and always responses with index.html because of SPA.
So far HTTP(ExpressJS) and HTTP2(NodeJS module) are incompatible.

### Server exposes interface with the only method:
### run(config, middlewares?, serverExtend?)
<ul>
    <li><b>config</b> - siegel config. Config pro</li>
    <li><b>middlewares</b> - ExpressJS middlewares. Thus affects only http(s) server. By default siegel passes webpack hot and dev middlewares.</li>
    <li><b>serverExtend</b> - resolved server extender</li>
</ul>