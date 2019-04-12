'use strict'

const rollup = require('rollup')

const config = require('../rollup-config')
const getSizeInfo = require('../get-size-info')
const spinner = require('../spinner')

module.exports = (program) => {
  program
    .command('build')
    .description('Creates a bundle for your library')
    .action(async () => {
      try {
        const metadata = { }
        const input = config.input(metadata)
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

          await getSizeInfo(Object.values(metadata.bundle)[0])
            .then((text) => {
              console.log(`Wrote ${text.trim()}`)
            })
        }
      } catch (err) {
        program.handleError(err)
      }
    })
}
