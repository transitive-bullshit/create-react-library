import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import svgr from '@svgr/rollup'

import pkg from './package.json'

const createConfig = ({ output }) => ({
  input: 'src/index.js',
  output: Object.assign({ sourcemap: true }, output),
  plugins: [
    external({ includeDependencies: true }),
    postcss({
      modules: true
    }),
    url(),
    svgr(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      plugins: [
        [
          '@babel/transform-runtime',
          { useESModules: output.format !== 'cjs' }
        ]
      ]
    }),
    resolve(),
    commonjs()
  ]
})

export default [
  createConfig({
    file: pkg.main,
    format: 'cjs',
  }),
  createConfig({
    file: pkg.module,
    format: 'esm',
  })
]
