const express = require('express')


module.exports = {
    //So far we can only extend ui core' static server
    extendExpressDevServer(app) {
        app.use(express.json())
    }
}