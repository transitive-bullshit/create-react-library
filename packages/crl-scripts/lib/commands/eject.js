'use strict'
const chalk = require('chalk')
const inquirer = require('inquirer')
const path = require('path')
const spawnSync = require('react-dev-utils/crossSpawn').sync
const execSync = require('child_process').execSync
const os = require('os')
const fs = require('fs-extra')

const green = chalk.green
const cyan = chalk.cyan
const red = chalk.red

module.exports = program => {
  program
    .command('eject')
    .description('Ejects your library from crl-scripts')
    .action(() => {
      const appDirectory = fs.realpathSync(process.cwd())
      const getAppPath = relativePath =>
        path.resolve(appDirectory, relativePath)
      const getOwnPath = relativePath =>
        path.resolve(__dirname, '..', relativePath)

      inquirer
        .prompt({
          type: 'confirm',
          name: 'shouldEject',
          message: 'Are you sure you want to eject? This action is permanent.',
          default: false
        })
        .then(answer => {
          if (!answer.shouldEject) {
            console.log(cyan('Close one! Eject aborted.'))
            return
          }
          console.log('Eject Starting')

          const gitStatus = getGitStatus()
          if (gitStatus) {
            console.error(
              red(
                'This git repository has untracked files or uncommitted changes:'
              ) +
                '\n\n' +
                gitStatus
                  .split('\n')
                  .map(line => line.match(/ .*/g)[0].trim())
                  .join('\n') +
                '\n\n' +
                red(
                  'Remove untracked files, stash or commit any changes, and try again.'
                )
            )
            process.exit(1)
          }

          const ownPath = getOwnPath('../')
          const appPath = getAppPath('.')

          function verifyAbsent(file) {
            if (fs.existsSync(path.join(appPath, file))) {
              console.error(
                `\`${file}\` already exists in your app folder. We cannot ` +
                  'continue as you would lose all the changes in that file or directory. ' +
                  'Please move or delete it (maybe make a copy for backup) and run this ' +
                  'command again.'
              )
              process.exit(1)
            }
          }

          const folders = ['lib', 'lib/commands']

          // Make shallow array of files paths
          const files = folders.reduce((files, folder) => {
            return files.concat(
              fs
                .readdirSync(path.join(ownPath, folder))
                // set full path
                .map(file => path.join(ownPath, folder, file))
                // omit dirs from file list
                .filter(file => fs.lstatSync(file).isFile())
            )
          }, [])

          folders.forEach(verifyAbsent)
          files.forEach(verifyAbsent)

          console.log()
          console.log(cyan(`Copying files into ${appPath}`))

          folders.forEach(folder => {
            fs.mkdirSync(path.join(appPath, folder))
          })

          console.log()

          files.forEach(file => {
            const content = fs.readFileSync(file, 'utf8')
            console.log(
              `  Adding ${cyan(file.replace(ownPath, ''))} to the project`
            )
            fs.writeFileSync(file.replace(ownPath, appPath), content)
          })
          console.log()

          const ownPackage = require(path.join(ownPath, 'package.json'))
          const appPackage = require(path.join(appPath, 'package.json'))

          console.log(cyan('Updating the dependencies'))
          const ownPackageName = ownPackage.name

          if (appPackage.devDependencies) {
            if (appPackage.devDependencies[ownPackageName]) {
              console.log(
                `  Removing ${cyan(ownPackageName)} from devDependencies`
              )
              delete appPackage.devDependencies[ownPackageName]
            }
          }
          Object.keys(ownPackage.dependencies).forEach(key => {
            if (
              ownPackage.optionalDependencies &&
              ownPackage.optionalDependencies[key]
            ) {
              return
            }
            console.log(`  Adding ${cyan(key)} to dependencies`)
            appPackage.dependencies[key] = ownPackage.dependencies[key]
          })
          // Sort the deps
          const unsortedDependencies = appPackage.dependencies
          appPackage.dependencies = {}
          Object.keys(unsortedDependencies)
            .sort()
            .forEach(key => {
              appPackage.dependencies[key] = unsortedDependencies[key]
            })
          console.log()

          console.log(cyan('Updating the scripts'))
          delete appPackage.scripts['eject']
          Object.keys(appPackage.scripts).forEach(key => {
            Object.keys(ownPackage.bin).forEach(binKey => {
              const regex = new RegExp(binKey + ' (\\w+)', 'g')
              if (!regex.test(appPackage.scripts[key])) {
                return
              }
              appPackage.scripts[key] = appPackage.scripts[key].replace(
                regex,
                'node lib/cli.js $1'
              )
              console.log(
                `  Replacing ${cyan(`"${binKey} ${key}"`)} with ${cyan(
                  `"node lib/cli.js ${key}"`
                )}`
              )
            })
          })

          console.log()
          console.log(cyan('Configuring package.json'))

          fs.writeFileSync(
            path.join(appPath, 'package.json'),
            JSON.stringify(appPackage, null, 2) + os.EOL
          )
          console.log()

          // "Don't destroy what isn't ours"
          if (ownPath.indexOf(appPath) === 0) {
            try {
              // remove crl-scripts and crl-scripts binaries from app node_modules
              Object.keys(ownPackage.bin).forEach(binKey => {
                console.log(path.join(appPath, 'node_modules', '.bin', binKey))
                fs.removeSync(
                  path.join(appPath, 'node_modules', '.bin', binKey)
                )
              })
              fs.removeSync(ownPath)
            } catch (e) {
              // It's not essential that this succeeds
            }
          }

          if (fs.existsSync(getAppPath('yarn.lock'))) {
            console.log(cyan('Running yarn...'))
            spawnSync('yarnpkg', ['--cwd', process.cwd()], {
              stdio: 'inherit'
            })
          } else {
            console.log(cyan('Running npm install...'))
            spawnSync('npm', ['install', '--loglevel', 'error'], {
              stdio: 'inherit'
            })
          }

          console.log(green('Ejected successfully!'))
          console.log()

          if (tryGitAdd(appPath)) {
            console.log(cyan('Staged ejected files for commit.'))
            console.log()
          }
          console.log()
        })
    })
}

function getGitStatus() {
  try {
    const stdout = execSync(`git status --porcelain`, {
      stdio: ['pipe', 'pipe', 'ignore']
    }).toString()
    return stdout.trim()
  } catch (e) {
    return ''
  }
}

function tryGitAdd(appPath) {
  try {
    spawnSync('git', ['add', path.join(appPath, 'lib')], {
      stdio: 'inherit'
    })

    return true
  } catch (e) {
    return false
  }
}
