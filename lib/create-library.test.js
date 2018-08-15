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
    manager: 'yarn',
    template: 'default',
    git: true
  },
  {
    name: 'my-test-typescript-library',
    author: 'nala',
    description: 'this is a auto-generated test module. please ignore.',
    repo: 'nala/my-test-library',
    license: 'MIT',
    manager: 'yarn',
    template: 'typescript',
    git: true
  },
  {
    name: 'my-test-library',
    author: 'nala',
    description: 'this is a auto-generated test module. please ignore.',
    repo: 'nala/my-test-library',
    license: 'MIT',
    manager: 'npm',
    template: 'default',
    git: true
  },
  {
    name: 'my-test-library',
    author: 'nala',
    description: 'this is a auto-generated test module. please ignore.',
    repo: 'nala/my-test-typescript-library',
    license: 'MIT',
    manager: 'npm',
    template: 'typescript',
    git: true
  },
  {
    name: '@automagical/nala',
    author: 'superstar-cats',
    description: 'this is a auto-generated test module. please ignore.',
    repo: 'superstar-cats/nala',
    license: 'GPL',
    manager: 'yarn',
    template: 'default',
    git: true
  },
  {
    name: 'no-git-library',
    author: 'nala',
    description: 'this is a auto-generated test module. please ignore.',
    repo: 'nala/no-git-library',
    license: 'MIT',
    manager: 'yarn',
    template: 'default',
    git: false
  },
  {
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
]

tests.forEach((opts) => {
  test.serial(`creating "${opts.name}" using ${opts.manager}`, async (t) => {
    console.log(`creating "${opts.name}" using ${opts.manager}...`)
    let ret

    // ensure library is created successfully
    const root = await createLibrary(opts)
    const example = path.join(root, 'example')
    t.truthy(root.indexOf(opts.shortName) >= 0)

    // ensure deps install successfully in root
    ret = await execa.shell(`${opts.manager} install`, { cwd: root })
    t.is(ret.code, 0)

    // ensure root tests pass
    ret = await execa.shell(`${opts.manager} test`, { cwd: root })
    t.is(ret.code, 0)

    // ensure deps install successfully in example
    ret = await execa.shell(`${opts.manager} install`, { cwd: example })
    t.is(ret.code, 0)

    // ensure bundle builds successfully in example
    ret = await execa.shell(`${opts.manager} build`, { cwd: example })
    t.is(ret.code, 0)

    // ensure git is initialized properly
    ret = await execa.shell('git rev-parse --git-dir', { cwd: root })
    t.is(ret.stdout, opts.git ? '.git' : path.join(process.cwd(), '.git'))

    await rmfr(root)
  })
})
