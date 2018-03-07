#!/usr/bin/env node
'use strict'

const meow = require('meow')

const getLibraryDefaults = require('./lib/get-library-defaults')
const createLibrary = require('./lib/create-library')
const promptLibraryInfo = require('./lib/prompt-library-info')

module.exports = async () => {
  const defaults = await getLibraryDefaults()
  const info = await promptLibraryInfo(defaults)
  await createLibrary(info)

  return info
}

if (!module.parent) {
  meow(`
    Usage
      $ create-react-library
  `)

  module.exports()
    .then((info) => {
      console.log(`

Your module has been created at ${info.dest}.

To get started, in one tab, run:
$ cd ${info.name} && ${info.manager} start

And in another tab, run the create-react-app devserver:
$ cd ${info.name}/example && ${info.manager} start
`)

      if (info.manager === 'npm') {
        console.log(`

Because you're using npm, you'll need to publish a dummy version of ${info.name} first before you can "npm link" your package into the example app.
`)
      }

      process.exit(0)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
