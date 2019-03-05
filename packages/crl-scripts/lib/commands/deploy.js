'use strict'

const execa = require('execa')
const fs = require('fs')
const path = require('path')
const pEachSeries = require('p-each-series')

const ghPagesLocal = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'gh-pages')
const ghPages = path.join(process.cwd(), 'node_modules', '.bin', 'gh-pages')

module.exports = (program) => {
  program
    .command('deploy')
    .description('Deploys your example CRA app to GitHub Pages')
    .action(async () => {
      try {
        let ghPagesBin = ghPages

        if (!fs.existsSync(ghPagesBin)) {
          ghPagesBin = ghPagesLocal

          if (!fs.existsSync(ghPagesBin)) {
            throw new Error('unable to find gh-pages executable')
          }
        }

        const cwd = process.cwd()
        const example = path.join(cwd, 'example')

        const commands = [
          [ 'yarn install', { cwd: example } ],
          [ 'yarn run build', { cwd: example } ],
          [ `${ghPagesBin} -d example/build`, { cwd } ]
        ]

        await pEachSeries(commands, (args) => {
          return execa.shell(...args)
          // shell.stdout.pipe(process.stdout)
          // shell.stderr.pipe(process.stderr)
        })
      } catch (err) {
        program.handleError(err)
      }
    })
}
