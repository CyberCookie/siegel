const express = require('express')


module.exports = {
    extendExpressDevServer(app) {
        console.log(1234)
        app.use(express.json())
    }
}