'use strict'

module.exports = (program, client) => {
  // this has to deferred to prevent a cyclical require loop
  const cli = require('../cli')

  program
    .command('help [cmd]')
    .description('Displays usage info for [cmd]')
    .action(async (arg, opts) => {
      if (!arg) {
        program.outputHelp()
        process.exit(0)
      } else {
        cli([ process.argv[0], process.argv[1], arg, '--help' ])
      }
    })
}
