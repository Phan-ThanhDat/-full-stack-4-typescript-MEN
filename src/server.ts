import errorHandler from 'errorhandler'
import bodyParser from 'body-parser'
import app from './app'

app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler())

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  )
  console.log('  Press CTRL-C to stop\n')
})

export default server
