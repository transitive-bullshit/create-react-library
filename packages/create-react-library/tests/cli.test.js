'use strict'

const test = require('ava')
const execa = require('execa')

test('--help', async (t) => {
  const { stdout } = await execa('./lib/cli.js', [ '--help' ])
  t.true(stdout.length > 0)
  t.true(/create-react-library/.test(stdout))
})
