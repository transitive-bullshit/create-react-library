'use strict'

const concurrently = require('concurrently')

module.exports = (program) => {
  program
    .command('develop')
    .description('Starts the bundler in watch mode for the component and example')
    .action(async () => {
      concurrently([
        'cd example && npm start',
        'wait-on -d 5000 http://localhost:3000/ && npm start'
    ], {
        prefix: 'name',
        killOthers: ['failure', 'success'],
        restartTries: 3,
    })
    })
}
