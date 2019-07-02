'use strict'

const debug = require('debug')('detect-secrets')
const which = require('which')

const PYTHON_PACKAGE_EXEC = 'detect-secrets-hook'

function isBinaryAvailableInPath(binary) {
  debug(`checking if the binary ${binary} for detect-secrets-hook exists`)
  let resolved
  try {
    resolved = which.sync(binary)
    debug(`found binary ${binary} at: ${resolved}`)
  } catch (error) {
    debug(error)
  }

  if (!resolved) {
    return false
  }

  return true
}

const pythonStrategy = isBinaryAvailableInPath(PYTHON_PACKAGE_EXEC)
