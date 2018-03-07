'use strict'

const getGitConfigPath = require('git-config-path')
const githubUsername = require('github-username')
const parseGitConfig = require('parse-git-config')
const which = require('which')

module.exports = async () => {
  const defaults = {
    author: undefined,
    manager: 'npm'
  }

  try {
    const gitConfigPath = getGitConfigPath('global')

    if (gitConfigPath) {
      const gitConfig = parseGitConfig.sync({ path: gitConfigPath })

      if (gitConfig.github && gitConfig.github.user) {
        defaults.author = gitConfig.github.user
      } else if (gitConfig.user && gitConfig.user.email) {
        defaults.author = await githubUsername(gitConfig.user.email)
      }
    }

    if (which.sync('yarn', { nothrow: true })) {
      defaults.manager = 'yarn'
    }
  } catch (err) { }

  return defaults
}
