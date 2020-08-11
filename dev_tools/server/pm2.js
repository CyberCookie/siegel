const pm2 = require('pm2')

//const config = require('../config')


pm2.connect(err => {
    if (err) {
        console.error(err)
        process.exit(2)
    }

    pm2.start({
        script: 'npm run serv'
    }, (err, apps) => {
        pm2.disconnect();

        if (err) throw err
    })
})