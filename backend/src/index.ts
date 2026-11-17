import { initMongoDB } from './db'
import app from './server'

/*
 * Seed the database, then start Express server.
 * initMongoDB exits the process when connecting or seeding fails.
 */
initMongoDB().then(() => {
    app.listen(app.get('port'), () => {
        console.log(`App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`)
        console.log('  Press CTRL-C to stop\n')
    })
})
