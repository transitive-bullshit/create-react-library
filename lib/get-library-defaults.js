'use strict'

const getGitConfigPath = require('git-config-path')
const githubUsername = require('github-username')
const parseGitConfig = require('parse-git-config')
const which = require('which')

const config = require('./config')

module.exports = async () => {
  const defaults = {
    author: config.get('author'),
    manager: config.get('manager', 'npm'),
    license: config.get('license', 'MIT'),
    language: config.get('language', 'javascript')
  }

  try {
    if (!config.get('author')) {
      const gitConfigPath = getGitConfigPath('global')

      if (gitConfigPath) {
        const gitConfig = parseGitConfig.sync({ path: gitConfigPath })

        if (gitConfig.github && gitConfig.github.user) {
          defaults.author = gitConfig.github.user
        } else if (gitConfig.user && gitConfig.user.email) {
          defaults.author = await githubUsername(gitConfig.user.email)
        }
      }

      if (defaults.author) {
        config.set('author', defaults.author)
      }
    }

    if (!config.get('manager')) {
      if (which.sync('yarn', { nothrow: true })) {
        defaults.manager = 'yarn'
      }

      config.set('manager', defaults.manager)
    }
  } catch (err) { }

  return defaults
}
