'use strict'

const ChildProcess = require('child_process')
jest.mock('child_process', () => {
  return {
    spawnSync: jest.fn(() => {
      //   return {
      //     status: 0
      //   }
    })
  }
})

process.exit = jest.fn()

const {executeStrategy} = require('../src/strategies')

describe('Strategies: executeStrategy', () => {
  beforeAll(() => {
    process.exit.mockClear()
    ChildProcess.spawnSync.mockClear()
    ChildProcess.spawnSync.mockReset()
  })

  test('when no arguments provided it shouldnt add anything to the spawned process', () => {
    process.argv = []

    const mockStrategy = {
      type: 'python',
      filePath: 'ls'
    }

    ChildProcess.spawnSync = jest.fn(() => {
      return {
        status: 0
      }
    })

    executeStrategy(mockStrategy)

    expect(ChildProcess.spawnSync.mock.calls.length).toBe(1)
    expect(ChildProcess.spawnSync.mock.calls[0][1]).toEqual([])
  })

  test('when arguments provided it should add them to the arguments of the command being spawned', () => {
    process.argv = []

    const mockedArguments = ['a', 'b', 'c']
    const mockStrategy = {
      type: 'python',
      filePath: 'ls',
      prefixCommandArguments: mockedArguments
    }

    ChildProcess.spawnSync = jest.fn(() => {
      return {
        status: 0
      }
    })

    executeStrategy(mockStrategy)

    expect(ChildProcess.spawnSync.mock.calls.length).toBe(1)
    expect(ChildProcess.spawnSync.mock.calls[0][1]).toEqual(mockedArguments)
  })
})
