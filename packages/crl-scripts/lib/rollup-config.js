const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const path = require('path')
const readPkg = require('read-pkg')
const postcss = require('rollup-plugin-postcss')
const resolve = require('rollup-plugin-node-resolve')
const url = require('rollup-plugin-url')
const svgr = require('@svgr/rollup')

exports.input = (metadata = { }) => {
  const pkg = readPkg.sync()

  const deps = Object.keys(pkg.dependencies || {})
  const peerDeps = Object.keys(pkg.peerDependencies || {})

  const external = ['dns', 'fs', 'path', 'url']
    .concat(deps)
    .concat(peerDeps)

  const externalPredicate = new RegExp(`^(${external.join('|')})($|/)`)
  const externalTest = external.length === 0
    ? () => false
    : id => externalPredicate.test(id)

  return {
    input: path.join(process.cwd(), 'src/index.js'),
    external: (id) => {
      if (id === 'babel-plugin-transform-async-to-promises/helpers') {
        return false
      }

      return externalTest(id)
    },
    plugins: [
      postcss({
        modules: true
      }),
      resolve(),
      commonjs({
        // use a regex to make sure to include eventual hoisted packages
        include: /\/node_modules\//
      }),
      json(),
      url({
        exclude: [ '**/*.svg' ]
      }),
      (svgr.default || svgr)(),
      babel({
        exclude: 'node_modules/**'
      }),
      {
        generateBundle: (outputOptions, bundle) => {
          metadata.bundle = bundle
        }
      }
    ]
  }
}

exports.outputs = () => {
  const pkg = readPkg.sync()
  const outputs = []

  if (pkg.main) {
    outputs.push({
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    })
  }

  if (pkg.module) {
    outputs.push({
      file: pkg.module,
      format: 'es',
      sourcemap: true
    })
  }

  if (!outputs.length) {
    throw new Error(`invalid package.json missing "main" or "module" field`)
  }

  return outputs
}
