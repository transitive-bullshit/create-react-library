'use strict'

const inquirer = require('inquirer')
const validateNpmName = require('validate-npm-package-name')

const config = require('./config')

module.exports = async (opts) => {
  const {
    skipPrompts,
    ...rest
  } = opts

  if (opts.name && !validateNpmName(opts.name).validForNewPackages) {
    throw new Error(`invalid package name "${opts.name}"`)
  }

  if (skipPrompts) {
    if (!opts.name) {
      throw new Error('invalid input; you must pass a package name with --skip-prompts')
    }
    const info = {}

    Object.keys(rest).forEach((key) => {
      const value = rest[key]
      if (typeof value === 'function') {
        info[key] = value(rest)
      } else {
        info[key] = value
      }
    })

    return info
  } else {
    const info = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Package Name',
        validate: (name) => {
          return name && validateNpmName(name).validForNewPackages
        },
        default: opts.name
      },
      {
        type: 'input',
        name: 'description',
        message: 'Package Description',
        default: opts.description
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author\'s GitHub Handle',
        default: opts.author
      },
      {
        type: 'input',
        name: 'repo',
        message: 'GitHub Repo Path',
        default: opts.repo
      },
      {
        type: 'input',
        name: 'license',
        message: 'License',
        default: opts.license
      },
      {
        type: 'list',
        name: 'manager',
        message: 'Package Manager',
        choices: [ 'npm', 'yarn' ],
        default: opts.manager
      },
      {
        type: 'list',
        name: 'typescript',
        message: 'TypeScript?',
        choices: [ 'typescript', 'javascript' ],
        default: opts.typescript ? 'typescript' : 'javascript'
      }
    ])

    info.typescript = (info.typescript === 'typescript')

    config.set('author', info.author)
    config.set('license', info.license)
    config.set('manager', info.manager)
    config.set('typescript', info.typescript)

    return {
      ...info,
      git: opts.git
    }
  }
}
