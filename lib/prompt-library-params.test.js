'use strict'

const test = require('ava')

const promptLibraryParams = require('./prompt-library-params')

const opts = {
  name: 'my-custom-template',
  author: 'nala',
  description: 'this is a auto-generated test module. please ignore.',
  repo: 'nala/my-custom-template',
  license: 'GPL',
  manager: 'yarn',
  template: 'custom',
  templatePath: './template/default',
  git: true
}

test('passed options are returned when skipPrompts is true', async (t) => {
  const result = await promptLibraryParams(
    Object.assign({}, opts, { skipPrompts: true })
  )
  Object.entries(opts).forEach((opt) => {
    t.is(opt[1], result[opt[0]])
  })
})
