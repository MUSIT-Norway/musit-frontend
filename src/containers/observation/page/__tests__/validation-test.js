import { validateFromTo } from '../validation'

describe('Validation.validateFromTo', () => {
  it('should verify that toValue must be greater than fromValue', () => {
    const formProps = {
      fromValue: '42,65',
      toValue: '42,40'
    }
    const errors = validateFromTo(formProps, 0, 'type')
    expect(errors).toMatchSnapshot()
  })

  it('should not accept fromValue or toValue with dots as comma', () => {
    const formProps = {
      fromValue: '44.65',
      toValue: '48.40'
    }
    const errors = validateFromTo(formProps, 0, 'type')
    expect(errors).toMatchSnapshot()
  })

  it('should validate that commentsValue cannot be longer than 250 chars', () => {
    const formProps = {
      fromValue: '44,65',
      toValue: '48,40',
      commentValue: 'x'.repeat(251)
    }
    const errors = validateFromTo(formProps, 0, 'type')
    expect(errors).toMatchSnapshot()
  })

  it('should validate correct values', () => {
    const formProps = {
      fromValue: '44,65',
      toValue: '48,40',
      commentValue: 'x'.repeat(250)
    }
    const errors = validateFromTo(formProps, 0, 'type')
    expect(errors).toMatchSnapshot()
  })
})