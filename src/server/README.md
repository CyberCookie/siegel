# Server
Server could be runned in HTTP / HTTP2 mode with or without secure layer depending on a server config you pass inside.
Static server already configured to serve brotli and gzip compressed files and always responce with index.html because of SPA.
So far HTTP (ExpressJS) and HTTP2 (NodeJS module) are incompatible.

###### Index file exposes interface with the only method:
#### run(config, middlewares?, serverExtend?)

###### config
Config parts that affects server:
server.host
server.port
server.http2
server.ssl
build.output

###### middlewares
ExpressJS middlewares thus affects only http(s) server. By default essence passes webpack hot and dev middlewares into this method.

###### serverExtend
config.server.extenderLoc