'use strict'

const camelCase = require('lodash.camelcase')
const flow = require('lodash.flow')
const kebabCase = require('lodash.kebabcase')
const mixin = require('lodash.mixin')
const snakeCase = require('lodash.snakecase')
const upperFirst = require('lodash.upperfirst')

// best solution for now https://github.com/lodash/lodash/pull/942
const m = mixin({'pascalCase': flow(camelCase, upperFirst)})

module.exports = handlebars => {
  handlebars.registerHelper({
    camelCase: s => camelCase(s),
    kebabCase: s => kebabCase(s),
    pascalCase: s => m.pascalCase(s),
    snakeCase: s => snakeCase(s)
  })
}
