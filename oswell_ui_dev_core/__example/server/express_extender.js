const express = require('../../__server_deps/express')


module.exports = app => {
    app.use(express.json())


    app.post('/api/test', (req, res) => {
        const body = req.body;

        res.json({
            sent: body,
            received: 'some_data'
        })
    })
}