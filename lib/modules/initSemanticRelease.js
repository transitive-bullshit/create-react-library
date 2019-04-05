'use strict'

const fs = require('fs')
const path = require('path')
const execa = require('execa')
const yaml = require('yaml')

const getReleaseSection = ({ info }) => ({
  prepare: [
    '@semantic-release/changelog',
    '@semantic-release/npm',
    {
      path: '@semantic-release/git',
      assets: [
        'package.json',
        info.manager === 'yarn' ? 'yarn.lock' : 'package-lock.json',
        'CHANGELOG.md'
      ],
      message:
        // eslint-disable-next-line no-template-curly-in-string
        'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }
  ]
})

const configSection = {
  commitizen: {
    path: './node_modules/cz-conventional-changelog'
  }
}

module.exports = async opts => {
  const { dest, info } = opts

  const packagesList = [
    'semantic-release',
    'commitizen',
    'cz-conventional-changelog',
    '@semantic-release/git',
    '@commitlint/cli',
    '@commitlint/config-conventional',
    '@semantic-release/changelog'
  ]

  const managerInstallCommand =
    info.manager === 'yarn' ? 'add --dev' : 'install --save-dev'
  const cmd = `
    ${info.manager} ${managerInstallCommand} ${packagesList.join(' ')}
  `.trim()

  // add `release` and `config` sections in package.json
  const packagePath = path.join(dest, 'package.json')
  const pkg = require(packagePath)
  const updatedPackage = {
    ...pkg,
    version: '0.0.0',
    release: getReleaseSection(opts),
    config: configSection,
    scripts: {
      ...pkg.scripts,
      cm: 'git-cz',
      'semantic-release': 'semantic-release'
    }
  }

  // edit template's Travis CI config
  const ciConfigPath = path.join(dest, '.travis.yml')
  const ciConfig = yaml.parse(fs.readFileSync(ciConfigPath, 'utf8'))
  const updatedCIConfig = {
    ...ciConfig,
    jobs: {
      include: [
        { stage: 'release', script: `${info.manager} run semantic-release` }
      ]
    }
  }
  fs.writeFileSync(ciConfigPath, yaml.stringify(updatedCIConfig))

  fs.writeFileSync(packagePath, JSON.stringify(updatedPackage, null, 2), 'utf8')

  return execa.shell(cmd, { cwd: dest })
}
