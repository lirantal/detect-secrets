/* eslint-disable security/detect-child-process */
'use strict'

const cli = require('../src/cli')

describe('detect-secrets-launcher CLI', () => {
  const originalArgv = process.argv
  beforeEach(() => { process.argv = [process.execPath, 'detect-secrets-launcher'] })
  afterEach(() => { process.argv = originalArgv })
  test('when successful to spawn a strategy should return exit code 0', () => {
    const executableStrategies = [
      {
        type: 'ls',
        filePath: 'ls'
      }
    ]

    const result = cli.start(executableStrategies)
    expect(result.strategyExitCode).toBe(0)
    expect(result.strategiesInvoked).toBe(true)
  })

  test('when failed to spawn executable should return exit code 1', () => {
    const executableStrategies = [
      {
        type: 'made up command',
        filePath: 'ls',
        // fake command arguments to make 'ls' command fail
        prefixCommandArguments: ['-ala-s33s']
      }
    ]

    const result = cli.start(executableStrategies)
    expect(result.strategyExitCode).not.toBe(0)
    expect(result.strategiesInvoked).toBe(true)
  })

  test('should not invoke strategy when not existing', () => {
    const executableStrategies = [
      {
        type: 'made up command',
        filePath: 'made up command'
      }
    ]

    const result = cli.start(executableStrategies)
    expect(result.strategiesInvoked).toBe(false)
  })
})
