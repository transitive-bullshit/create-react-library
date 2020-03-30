'use strict'

const getGitConfigPath = require('git-config-path')
const githubUsername = require('github-username')
const parseGitConfig = require('parse-git-config')
const which = require('which')

const config = require('./config')

module.exports = async () => {
  const defaults = {
    name: '',
    description: 'Made with create-react-library',
    author: config.get('author'),
    repo: (info) => `${info.author}/${info.name}`,
    license: config.get('license', 'MIT'),
    manager: config.get('manager', 'npm'),
    template: config.get('template', 'default')
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

    if (!config.get('template')) {
      config.set('template', defaults.template)
    }
  } catch (err) {}

  return defaults
}
