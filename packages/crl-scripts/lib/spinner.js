'use strict'

const Ora = require('ora')

module.exports = (action, options) => {
  if (typeof action.then !== 'function') {
    throw new TypeError('Parameter `action` must be a Promise')
  }

  const spinner = new Ora(options)
  spinner.start()

  return action.then(
    (result) => {
      spinner.succeed()
      return result
    },
    (err) => {
      spinner.fail()
      throw err
    }
  )
}
