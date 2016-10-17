import { validateFromTo } from '../validation'
import { keys } from 'lodash'

describe('Validation util', () => {
  it('validateFromTo should work with decimal numbers', () => {
    const formProps = {
      fromValue: '42,65',
      toValue: '42,40'
    }
    const errors = validateFromTo(formProps, 0, 'type')
    expect(errors).toMatchSnapshot()
  })
})