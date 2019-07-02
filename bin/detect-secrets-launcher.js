#!/usr/bin/env node
/* eslint-disable security/detect-child-process */
/* eslint-disable no-process-exit */
'use strict'

const {isExecutableAvailableInPath, executeStrategy} = require('../src/strategies')

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

executableStrategies.forEach(strategy => {
  const strategyExists = isExecutableAvailableInPath(strategy.filePath)
  if (strategyExists) {
    executeStrategy(strategy)
    process.exit(1)
  }
})
