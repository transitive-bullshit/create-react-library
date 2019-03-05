#!/usr/bin/env node
'use strict'

const program = require('commander')

const { name, version } = require('../package')

const handleError = require('./handle-error')
const commands = require('./commands')

module.exports = (argv, opts = { }) => {
  program
    .name(name)
    .version(version)

  program.handleError = handleError

  for (const command of commands) {
    command(program)
  }

  program.on('command:*', () => {
    console.error(`Invalid command: "${program.args.join(' ')}"`)
    console.error()
    program.outputHelp()
    process.exit(1)
  })

  program.parse(argv)
}

if (!module.parent) {
  module.exports(process.argv)
}
