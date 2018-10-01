'use strict'

const handlebars = require('handlebars')
const execa = require('execa')
const fs = require('fs')
const globby = require('globby')
const mkdirp = require('make-dir')
const ora = require('ora')
const path = require('path')
const pEachSeries = require('p-each-series')

const pkg = require('../package')

module.exports = async (info) => {
  const {
    manager,
    template,
    name,
    templatePath,
    git
  } = info

  // handle scoped package names
  const parts = name.split('/')
  info.shortName = parts[parts.length - 1]

  const dest = path.join(process.cwd(), info.shortName)
  info.dest = dest
  await mkdirp(dest)

  const source = template === 'custom'
    ? path.join(process.cwd(), templatePath)
    : path.join(__dirname, '..', 'template', template)
  const files = await globby(source, {
    dot: true
  })

  {
    const promise = pEachSeries(files, async (file) => {
      return module.exports.copyTemplateFile({
        file,
        source,
        dest,
        info
      })
    })
    ora.promise(promise, `Copying ${template} template to ${dest}`)
    await promise
  }

  {
    const promise = module.exports.initPackageManager({ dest, info })
    ora.promise(promise, `Running ${manager} install and ${manager} link`)
    await promise
  }

  if (git) {
    const promise = module.exports.initGitRepo({ dest })
    ora.promise(promise, 'Initializing git repo')
    await promise
  }

  return dest
}

module.exports.copyTemplateFile = async (opts) => {
  const {
    file,
    source,
    dest,
    info
  } = opts

  const fileRelativePath = path.relative(source, file)
  const destFilePath = path.join(dest, fileRelativePath)
  const destFileDir = path.parse(destFilePath).dir

  const template = handlebars.compile(fs.readFileSync(file, 'utf8'))
  const content = template({
    ...info,
    yarn: (info.manager === 'yarn')
  })

  await mkdirp(destFileDir)
  fs.writeFileSync(destFilePath, content, 'utf8')

  return fileRelativePath
}

module.exports.initPackageManager = async (opts) => {
  const {
    dest,
    info
  } = opts

  const example = path.join(dest, 'example')

  const commands = [
    {
      cmd: `${info.manager} install`,
      cwd: dest
    },
    {
      cmd: `${info.manager} link`,
      cwd: dest
    },
    {
      cmd: `${info.manager} install`,
      cwd: example
    }
  ]

  return pEachSeries(commands, async ({ cmd, cwd }) => {
    return execa.shell(cmd, { cwd })
  })
}

module.exports.initGitRepo = async (opts) => {
  const {
    dest
  } = opts

  const gitIgnorePath = path.join(dest, '.gitignore')
  fs.writeFileSync(gitIgnorePath, `
# See https://help.github.com/ignore-files/ for more about ignoring files.

# dependencies
node_modules

# builds
build
dist
.rpt2_cache

# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
`, 'utf8')

  const cmd = `git init && git add . && git commit -m "init ${pkg.name}@${pkg.version}"`
  return execa.shell(cmd, { cwd: dest })
}
