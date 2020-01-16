'use strict'

const test = require('ava')
const execa = require('execa')
const path = require('path')
const rmfr = require('rmfr')
const tempy = require('tempy')

const createLibrary = require('../lib/create-library')

const tests = [
  {
    name: 'my-test-library-yarn',
    author: 'nala',
    description: 'this is an auto-generated test module. please ignore.',
    repo: 'nala/my-test-library',
    license: 'MIT',
    manager: 'yarn',
    git: true
  }
  /*,
  {
    name: 'my-test-library-yarn-ts',
    author: 'nala',
    description: 'this is an auto-generated test module. please ignore.',
    repo: 'nala/my-test-library',
    license: 'GPL',
    manager: 'yarn',
    git: true
  },
  {
    name: 'my-test-library-npm',
    author: 'nala',
    description: 'this is an auto-generated test module. please ignore.',
    repo: 'nala/my-test-library',
    license: 'MIT',
    manager: 'npm',
    git: false
  }
  */
]

tests.forEach((opts, index) => {
  test.serial(`${index} creating "${opts.name}" using ${opts.manager}`, async (t) => {
    const dest = tempy.directory()

    console.log(`${index} creating "${opts.name}" using ${opts.manager}...`)
    console.log(dest)

    let ret

    // ensure library is created successfully
    const root = await createLibrary({
      ...opts,
      dest
    })
    const example = path.join(root, 'example')

    // ensure deps install successfully in root
    console.log(opts.name, opts.manager, 'install')
    ret = await execa(`${opts.manager} install`, { cwd: root, shell: true })
    t.is(ret.exitCode, 0)

    // ensure root tests pass
    console.log(opts.name, opts.manager, 'test')
    ret = await execa(`${opts.manager} test`, { cwd: root, shell: true })
    t.is(ret.exitCode, 0)

    // ensure deps install successfully in example
    console.log(opts.name, '(example)', opts.manager, 'install')
    ret = await execa(`${opts.manager} install`, { cwd: example, shell: true })
    t.is(ret.exitCode, 0)

    // ensure bundle builds successfully in example
    console.log(opts.name, '(example)', opts.manager, 'build')
    ret = await execa(`${opts.manager} build`, { cwd: example, shell: true })
    t.is(ret.exitCode, 0)

    // ensure git is initialized properly
    ret = await execa('git rev-parse --git-dir', { cwd: root, shell: true })
    t.is(ret.stdout, opts.git ? '.git' : path.join(process.cwd(), '.git'))

    await rmfr(root)
  })
})
