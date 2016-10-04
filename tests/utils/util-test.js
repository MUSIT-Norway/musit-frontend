import assert from 'assert'
import { parseISODateNonStrict, parseISODateStrict } from '../../src/utils/index.js'

describe('parseISODateNonStrict', () => {
  it('should accept full iso timestamp', () => {
    const date = '2016-09-07T22:56:00+00:00'
    const parsed = parseISODateNonStrict(date)
    assert(parsed.isValid() === true)
  })

  it('should accept standard simple ISO date format', () => {
    const date = '2016-12-23'
    const parsed = parseISODateNonStrict(date)
    assert(parsed.isValid() === true)
  })
})

describe('parseISODateStrict', () => {
  it('should reject full iso timestamp', () => {
    const date = '2016-09-07T22:56:00+00:00'
    const parsed = parseISODateStrict(date)
    assert(parsed.isValid() === false)
  })

  it('should accept standard simple ISO date format', () => {
    const date = '2016-09-07'
    const parsed = parseISODateStrict(date)
    assert(parsed.isValid() === true)
  })
})
