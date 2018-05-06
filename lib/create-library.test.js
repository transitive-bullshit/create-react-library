'use strict'

const { test } = require('ava')
const execa = require('execa')
const path = require('path')
const rmfr = require('rmfr')

const createLibrary = require('./create-library')

const tests = [
  {
    name: 'my-test-library',
    author: 'nala',
    description: 'this is a auto-generated test module. please ignore.',
    repo: 'nala/my-test-library',
    license: 'MIT',
    manager: 'yarn'
  },
  {
    name: 'my-test-library',
    author: 'nala',
    description: 'this is a auto-generated test module. please ignore.',
    repo: 'nala/my-test-library',
    license: 'MIT',
    manager: 'npm'
  },
  {
    name: '@automagical/nala',
    author: 'superstar-cats',
    description: 'this is a auto-generated test module. please ignore.',
    repo: 'superstar-cats/nala',
    license: 'GPL',
    manager: 'yarn'
  }
]

tests.forEach((info) => {
  test.serial(`creating "${info.name}" using ${info.manager}`, async (t) => {
    console.log(`creating "${info.name}" using ${info.manager}...`)
    let ret

    // ensure library is created successfully
    const root = await createLibrary(info)
    t.truthy(root.indexOf(info.shortName) >= 0)

    // ensure yarn runs successfully in src/
    ret = await execa.shell('yarn', { cwd: root })
    t.is(ret.code, 0)

    // ensure jest tests pass
    ret = await execa.shell('yarn test', { cwd: root })
    t.is(ret.code, 0)

    if (info.manager === 'yarn') {
      // ensure yarn runs successfully in example/
      ret = await execa.shell('yarn install', { cwd: path.join(root, 'example') })
      t.is(ret.code, 0)
    }

    // ensure git is initialized properly
    ret = await execa.shell('git status', { cwd: root })
    t.is(ret.code, 0)

    await rmfr(root)
  })
})
