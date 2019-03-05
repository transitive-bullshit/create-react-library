'use strict'

const rollup = require('rollup')

const config = require('../rollup-config')
const spinner = require('../spinner')

module.exports = (program) => {
  program
    .command('build')
    .description('Creates a bundle for your library')
    .action(async () => {
      try {
        const input = config.input()
        const outputs = config.outputs()

        const bundle = await spinner(
          rollup.rollup(input),
          'Compiling bundle'
        )

        for (const output of outputs) {
          await spinner(
            bundle.write(output),
            `Generating ${output.format} bundle`
          )
        }
      } catch (err) {
        program.handleError(err)
      }
    })
}
