'use strict'

module.exports = (err) => {
  const detail = err.response
    ? (err.response.data && err.response.data.error) || err.response.statusText
    : undefined

  console.error(err.message)
  if (detail) {
    console.error(detail)
  }

  process.exit(1)
}
