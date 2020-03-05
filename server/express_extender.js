const express = require('express')


module.exports = app => {
    app.use(express.json())


    app.post('/api/test', (req, res) => {
        let body = req.body;

        res.json({
            sent: body,
            received: 'some_data'
        })
    })
}