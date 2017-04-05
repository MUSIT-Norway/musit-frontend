import { getBoolField, getStrField } from '../analysisAddForm';

describe('analysisAddForm', () => {
  it('should have working getBoolField method', () => {
    const boolField = getBoolField('someBool');
    expect(boolField).toMatchSnapshot();
  });
  it('should have working getStrField method', () => {
    const strField = getStrField('someStr');
    expect(strField).toMatchSnapshot();
  });
});
