'use strict'

// eslint-disable-next-line security/detect-child-process
const ChildProcess = require('child_process')
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
if (pythonStrategy) {
  const hookCommandArguments = process.argv.slice(2) || []
  debug(
    `received ${hookCommandArguments.length} command arguments: ${JSON.stringify(
      hookCommandArguments
    )}`
  )

  ChildProcess.spawnSync(PYTHON_PACKAGE_EXEC, hookCommandArguments, {
    stdio: 'inherit',
    shell: true
  })
}
