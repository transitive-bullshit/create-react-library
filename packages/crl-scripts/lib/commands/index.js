'use strict'

const fs = require('fs')

module.exports = fs.readdirSync(__dirname)
  .filter((f) => f !== 'index.js')
  .map((f) => require(`./${f.replace('.js', '')}`))
