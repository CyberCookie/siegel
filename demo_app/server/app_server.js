module.exports = (app, { express }) => {
    app.use(express.json())
    
    app.post('/api/send_data', (req, res) => {
        res.json( req.body )
    })
}