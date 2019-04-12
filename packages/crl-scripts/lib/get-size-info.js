// courtesy of https://github.com/developit/microbundle

const chalk = require('chalk')
const gzipSize = require('gzip-size')
const path = require('path')
const prettyBytes = require('pretty-bytes')

module.exports = async function getSizeInfo (assetInfo) {
  const { code, fileName } = assetInfo
  const raw = code.length < 5000
  const norm = formatSize(Buffer.from(code, 'utf8').byteLength, fileName, undefined, raw)
  const gzip = formatSize(await gzipSize(code), fileName, 'gz', raw)
  return norm + '\n' + gzip
}

function formatSize (size, filename, type, raw) {
  const pretty = raw ? `${size} B` : prettyBytes(size)
  const color = size < 5000 ? 'green' : size > 40000 ? 'red' : 'yellow'
  const MAGIC_INDENTATION = type === 'gz' ? 12 : 10
  return `${' '.repeat(MAGIC_INDENTATION - pretty.length)}${chalk[color](
    pretty
  )}: ${chalk.white(path.basename(filename))}${type ? '.' + type : ''}`
}
