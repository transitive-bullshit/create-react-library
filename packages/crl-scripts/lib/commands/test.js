'use strict'

const execa = require('execa')
const fs = require('fs')
const path = require('path')

const reactScriptsLocal = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'react-scripts')
const reactScripts = path.join(process.cwd(), 'node_modules', '.bin', 'react-scripts')

module.exports = (program) => {
  program
    .command('test')
    .description('Runs jest unit tests')
    .action(async () => {
      try {
        let reactScriptsBin = reactScripts

        if (!fs.existsSync(reactScriptsBin)) {
          reactScriptsBin = reactScriptsLocal

          if (!fs.existsSync(reactScriptsBin)) {
            throw new Error('unable to find react-scripts')
          }
        }

        await execa(`CI=true SKIP_PREFLIGHT_CHECK=true ${reactScriptsBin} test`, { cwd: process.cwd(), shell: true })
      } catch (err) {
        program.handleError(err)
      }
    })
}
