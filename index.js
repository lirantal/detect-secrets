/* eslint-disable security/detect-child-process */
/* eslint-disable no-process-exit */
'use strict'

const ChildProcess = require('child_process')
const debug = require('debug')('detect-secrets')
const which = require('which')

const PYTHON_PACKAGE_EXEC = 'detect-secrets-hook'
const DOCKER_EXEC = 'docker'
const DOCKER_IMAGE_NAME = 'lirantal/detect-secrets'

const pwd = process.cwd()
const executableStrategies = [
  {
    type: 'python',
    filePath: PYTHON_PACKAGE_EXEC
  },
  {
    type: 'docker',
    filePath: DOCKER_EXEC,
    prefixCommandArguments: [
      'run',
      '-it',
      '--rm',
      '--name',
      'detect-secrets',
      '--volume',
      `${pwd}:/usr/src/app`,
      `${DOCKER_IMAGE_NAME}`
    ]
  }
]

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

function executeStrategy(strategy) {
  let hookCommandArguments = process.argv.slice(2) || []
  debug(
    `received ${hookCommandArguments.length} command arguments: ${JSON.stringify(
      hookCommandArguments
    )}`
  )

  if (strategy.prefixCommandArguments && strategy.prefixCommandArguments.length > 0) {
    hookCommandArguments = strategy.prefixCommandArguments.concat(hookCommandArguments)
  }

  const spawnResult = ChildProcess.spawnSync(strategy.filePath, hookCommandArguments, {
    stdio: 'inherit',
    shell: true
  })

  process.exit(spawnResult.status)
}

executableStrategies.forEach(strategy => {
  const strategyExists = isExecutableAvailableInPath(strategy.filePath)
  if (strategyExists) {
    executeStrategy(strategy)
    process.exit(1)
  }
})
