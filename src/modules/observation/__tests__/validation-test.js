import {
  validateFromTo,
  validateAlcohol,
  validatePest,
  validateDoubleTextArea
} from '../observationValidation';

describe('Validation.validateAlcohol', () => {
  it('should verify that statusValue cannot be null', () => {
    const formProps = {
      statusValue: null
    };
    const errors = validateAlcohol(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should verify that statusValue cannot be empty', () => {
    const formProps = {
      statusValue: ''
    };
    const errors = validateAlcohol(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should verify that statusValue cannot be empty space', () => {
    const formProps = {
      statusValue: ' '
    };
    const errors = validateAlcohol(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should verify that volumeValue cannot be greater than 10', () => {
    const formProps = {
      statusValue: 'something',
      volumeValue: '11111111111,34'
    };
    const errors = validateAlcohol(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should verify that volumeValue cannot contain dots', () => {
    const formProps = {
      statusValue: 'something',
      volumeValue: '11.34'
    };
    const errors = validateAlcohol(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should validate that commentsValue cannot be longer than 250 chars', () => {
    const formProps = {
      statusValue: 'something',
      volumeValue: '11,34',
      commentValue: 'x'.repeat(251)
    };
    const errors = validateAlcohol(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should validate correct values', () => {
    const formProps = {
      statusValue: 'something',
      volumeValue: '11,34',
      commentValue: 'x'.repeat(250)
    };
    const errors = validateAlcohol(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });
});

describe('Validation.validateFromTo', () => {
  it('should verify that fromValue cannot be null', () => {
    const formProps = {
      fromValue: null
    };
    const errors = validateFromTo(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should verify that fromValue cannot be empty', () => {
    const formProps = {
      fromValue: ''
    };
    const errors = validateFromTo(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should verify that fromValue cannot be empty space', () => {
    const formProps = {
      fromValue: ' '
    };
    const errors = validateFromTo(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should verify that toValue must be greater than fromValue', () => {
    const formProps = {
      fromValue: '42,65',
      toValue: '42,40'
    };
    const errors = validateFromTo(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should not accept fromValue or toValue with dots as comma', () => {
    const formProps = {
      fromValue: '44.65',
      toValue: '48.40'
    };
    const errors = validateFromTo(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should validate that commentsValue cannot be longer than 250 chars', () => {
    const formProps = {
      fromValue: '44,65',
      toValue: '48,40',
      commentValue: 'x'.repeat(251)
    };
    const errors = validateFromTo(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should validate correct values', () => {
    const formProps = {
      fromValue: '44,65',
      toValue: '48,40',
      commentValue: 'x'.repeat(250)
    };
    const errors = validateFromTo(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });
});

describe('Validation.validatePest', () => {
  it('should verify that identificationValue cannot be null', () => {
    const formProps = {
      identificationValue: null,
      observations: []
    };
    const errors = validatePest(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should verify that identificationValue cannot be empty', () => {
    const formProps = {
      identificationValue: '',
      observations: []
    };
    const errors = validatePest(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should verify that identificationValue cannot be empty space', () => {
    const formProps = {
      identificationValue: ' ',
      observations: []
    };
    const errors = validatePest(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should verify that commentValue cannot be longer than 250 chars', () => {
    const formProps = {
      identificationValue: 'something',
      commentValue: 'x'.repeat(251),
      observations: []
    };
    const errors = validatePest(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should verify correct values', () => {
    const formProps = {
      identificationValue: 'something',
      commentValue: 'x'.repeat(250),
      observations: [
        {
          count: 11,
          lifeCycle: 'flies'
        }
      ]
    };
    const errors = validatePest(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should verify that an observation with count and not lifecycle is not allowed', () => {
    const formProps = {
      identificationValue: 'something',
      commentValue: 'x'.repeat(250),
      observations: [
        {
          count: 1
        }
      ]
    };
    const errors = validatePest(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should verify that an observation with count larger than 10 numbers is not allowed', () => {
    const formProps = {
      identificationValue: 'something',
      commentValue: 'x'.repeat(250),
      observations: [
        {
          lifeCycle: 'something',
          count: '11111111111'
        }
      ]
    };
    const errors = validatePest(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should verify that an observation with only lifecycle is allowed', () => {
    const formProps = {
      identificationValue: 'something',
      commentValue: 'x'.repeat(250),
      observations: [
        {
          lifeCycle: 'something'
        }
      ]
    };
    const errors = validatePest(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should verify that an observation with empty lifeCycle is not allowed', () => {
    const formProps = {
      identificationValue: 'something',
      commentValue: 'x'.repeat(250),
      observations: [
        {
          lifeCycle: ' '
        }
      ]
    };
    const errors = validatePest(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });
});

describe('Validate.validateDoubleTextArea', () => {
  it('should work with correct data', () => {
    const formProps = {
      leftValue: 'something',
      rightValue: 'something else'
    };
    const errors = validateDoubleTextArea(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should fail with no leftValue', () => {
    const formProps = {
      leftValue: null
    };
    const errors = validateDoubleTextArea(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });

  it('should fail with empty space leftValue', () => {
    const formProps = {
      leftValue: ' '
    };
    const errors = validateDoubleTextArea(formProps, 0, 'type');
    expect(errors).toMatchSnapshot();
  });
});
