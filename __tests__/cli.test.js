/* eslint-disable security/detect-child-process */
'use strict'

const ChildProcess = require('child_process')
const path = require('path')

const executableCLI = path.join(__dirname, '../bin/detect-secrets-launcher.js')

describe('detect-secrets-launcher CLI', () => {
  test('when failed to spawn detect-secrets-hook should use exit code 1 and show warning', done => {
    const processHandler = ChildProcess.spawn(executableCLI, ['fakeArgument'])

    processHandler.on('close', exitCode => {
      expect(exitCode).toEqual(1)
      done()
    })
  })
})
