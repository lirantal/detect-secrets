'use strict'

// eslint-disable-next-line security/detect-child-process
const ChildProcess = require('child_process')
const debug = require('debug')('detect-secrets')
const which = require('which')

const PYTHON_PACKAGE_EXEC = 'detect-secrets-hook'

function isExecutableAvailableInPath(executable) {
  debug(`checking if the executable ${executable} exists`)
  let resolved
  try {
    resolved = which.sync(executable)
    debug(`found executable ${executable} at: ${resolved}`)
  } catch (error) {
    debug(error)
  }

  if (!resolved) {
    return false
  }

  return true
}

const pythonStrategy = isExecutableAvailableInPath(PYTHON_PACKAGE_EXEC)
if (pythonStrategy) {
  const hookCommandArguments = process.argv.slice(2) || []
  debug(
    `received ${hookCommandArguments.length} command arguments: ${JSON.stringify(
      hookCommandArguments
    )}`
  )

  const spawnResult = ChildProcess.spawnSync(PYTHON_PACKAGE_EXEC, hookCommandArguments, {
    stdio: 'inherit',
    shell: true
  })

  // eslint-disable-next-line no-process-exit
  process.exit(spawnResult.status)
}
