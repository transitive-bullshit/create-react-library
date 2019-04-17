const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const fs = require('fs-extra')
const path = require('path')
const readPkg = require('read-pkg')
const postcss = require('rollup-plugin-postcss')
const resolve = require('rollup-plugin-node-resolve')
const typescript = require('rollup-plugin-typescript2')
const url = require('rollup-plugin-url')
const svgr = require('@svgr/rollup')

const input = (metadata = { }) => {
  const pkg = readPkg.sync()

  const deps = Object.keys(pkg.dependencies || {})
  const peerDeps = Object.keys(pkg.peerDependencies || {})

  const external = ['dns', 'fs', 'path', 'url']
    .concat(deps)
    .concat(peerDeps)

  const externalBlacklist = new Set(external)
  const inputJS = path.join(process.cwd(), 'src', 'index.js')
  const inputTS = path.join(process.cwd(), 'src', 'index.tsx')
  const useTypescript = fs.existsSync(inputTS)
  const input = useTypescript ? inputTS : inputJS

  return {
    input,
    external: (id) => {
      if (id === 'babel-plugin-transform-async-to-promises/helpers') {
        return false
      }

      return externalBlacklist.has(id)
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
      useTypescript && typescript({
        typescript: require('typescript'),
        rollupCommonJSResolveHack: true,
        clean: true
      }),
      !useTypescript && babel({
        exclude: 'node_modules/**'
      }),
      {
        generateBundle: (outputOptions, bundle) => {
          metadata.bundle = bundle
        }
      }
    ].filter(Boolean)
  }
}

const outputs = () => {
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
    throw new Error(`Invalid package.json. Must include either a "main" or "module" field.`)
  }

  return outputs
}

module.exports = {
  ...input(),
  output: outputs
}

module.exports.input = input
module.exports.outputs = outputs
