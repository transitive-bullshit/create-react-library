'use strict'

module.exports = (program) => {
  program
    .command('eject')
    .description('Ejects your library from crl-scripts')
    .action(async () => {
      try {
        console.error('Error this functionality has yet to be implemented.')
        process.exit(1)
      } catch (err) {
        program.handleError(err)
      }
    })
}
