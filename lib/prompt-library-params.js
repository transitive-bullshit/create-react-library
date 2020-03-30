'use strict'

const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const validateNpmName = require('validate-npm-package-name')

const config = require('./config')

module.exports = async (opts) => {
  if (opts.name && !validateNpmName(opts.name).validForNewPackages) {
    throw new Error(`invalid package name "${opts.name}"`)
  }

  if (opts.skipPrompts) {
    if (!opts.name) {
      throw new Error(
        'invalid input; you must pass a package name with --skip-prompts'
      )
    }

    Object.keys(opts).forEach((key) => {
      const value = opts[key]
      if (typeof value === 'function') {
        opts[key] = value(opts)
      }
    })

    return opts
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
        message: "Author's GitHub Handle",
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
        choices: ['npm', 'yarn'],
        default: opts.manager
      },
      {
        type: 'list',
        name: 'template',
        message: 'Template',
        choices: ['default', 'typescript', 'custom'],
        default: opts.template
      },
      {
        type: 'input',
        name: 'templatePath',
        message: 'Template Path',
        default: opts.templatePath,
        when: ({ template }) => template === 'custom',
        validate: (input) =>
          new Promise((resolve) => {
            const fullPath = path.resolve(process.cwd(), input)
            fs.stat(fullPath, (err, stats) => {
              if (err) {
                return resolve(`Cannot resolve directory at: ${fullPath}`)
              }
              resolve(true)
            })
          })
      }
    ])

    config.set('author', info.author)
    config.set('license', info.license)
    config.set('manager', info.manager)
    config.set('template', info.template)

    return {
      ...info,
      git: opts.git
    }
  }
}
