'use strict'

const {isExecutableAvailableInPath} = require('../src/strategies')

describe('Strategies: isExecutableAvailableInPath', () => {
  test('resolves the running Node executable using the real which dependency', () => {
    expect(isExecutableAvailableInPath(process.execPath)).toBe(true)
  })

  test('should find a binary and result in success', () => {
    const executable = 'ls'
    const result = isExecutableAvailableInPath(executable)
    expect(result).toBe(true)
  })

  test('should not find a made up binary name and result in error', () => {
    const executable = 'c3c3c2'
    const result = isExecutableAvailableInPath(executable)
    expect(result).toBe(false)
  })
})
