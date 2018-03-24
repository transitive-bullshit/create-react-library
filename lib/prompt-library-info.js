'use strict'

const inquirer = require('inquirer')
const validateNpmName = require('validate-npm-package-name')

const config = require('./config')

module.exports = async (defaults) => {
  const info = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Package Name',
      validate: (name) => {
        return name && validateNpmName(name).validForNewPackages
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Package Description',
      default: ''
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author\'s GitHub Handle',
      default: defaults.author
    },
    {
      type: 'input',
      name: 'repo',
      message: 'GitHub Repo Path',
      default: (info) => `${info.author}/${info.name}`
    },
    {
      type: 'input',
      name: 'license',
      message: 'License',
      default: defaults.license
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Package Manager',
      choices: [ 'npm', 'yarn' ],
      default: defaults.manager
    }
  ])

  config.set('author', info.author)
  config.set('manager', info.manager)
  config.set('license', info.license)

  return info
}
