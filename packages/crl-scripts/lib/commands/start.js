'use strict'

const ora = require('ora')
const rollup = require('rollup')

const config = require('../rollup-config')
const getSizeInfo = require('../get-size-info')

const WATCH_OPTS = {
  exclude: 'node_modules/**'
}

module.exports = (program) => {
  program
    .command('start')
    .description('Starts the bundler in watch mode')
    .action(async () => {
      let watcher = null
      let spinner = null

      try {
        const metadata = { }
        const input = config.input(metadata)
        const outputs = config.outputs()

        watcher = rollup.watch({
          ...input,
          output: outputs,
          watch: WATCH_OPTS
        })

        watcher.on('event', (event) => {
          if (event.code === 'START') {
            spinner = ora('Bundling...').start()
          }

          if (event.code === 'FATAL') {
            if (spinner) {
              spinner.fail()
              spinner = null
            }

            return program.handleError(event.error)
          } else if (event.code === 'ERROR') {
            if (spinner) {
              spinner.fail()
              spinner = null
            }

            return program.handleError(event.error)
          }

          if (event.code === 'END') {
            if (spinner) {
              spinner.succeed()
              spinner = null
            }

            getSizeInfo(Object.values(metadata.bundle)[0])
              .then((text) => {
                console.log(`Wrote ${text.trim()}`)
              })
          }
        })
      } catch (err) {
        if (watcher) {
          watcher.close()
          watcher = null
        }

        return program.handleError(err)
      }
    })
}
