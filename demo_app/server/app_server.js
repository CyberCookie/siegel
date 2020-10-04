module.exports = (app, { express }) => {
    app.use(express.json()) // remove if use proxy since body will be corrupted on the other end.
    
    app.post('/api/send_data', (req, res) => {
        res.json( req.body )
    })
}