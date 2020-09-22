module.exports = (app, { express }) => {
    app.use(express.json())
    
    app.post('/api/test', (req, res) => {
        const body = req.body;
        
        res.json({
            sent: body,
            received: 'some_data'
        })
    })
}