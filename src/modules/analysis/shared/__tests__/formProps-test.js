// @flow
import { getExtraAttributeValue } from '../formProps';

describe('getExtraAttributeValue', () => {
  it('should return the input value if its a string', () => {
    const evt = {
      preventDefault: () => {},
      target: {
        value: 'Hallo'
      }
    };
    const type = 'String';
    const result = getExtraAttributeValue(evt, type);
    expect(result).toEqual('Hallo');
  });

  it('should return the selected option for a single select as int', () => {
    const evt = {
      preventDefault: () => {},
      target: {
        value: '',
        options: [{ selected: true, value: '1' }]
      }
    };
    const type = 'Int';
    const result = getExtraAttributeValue(evt, type);
    expect(result).toEqual(1);
  });

  it('should return the selected options for a multiple select as an array of ints', () => {
    const evt = {
      preventDefault: () => {},
      target: {
        value: '',
        options: [
          { selected: true, value: '1' },
          { selected: true, value: '2' },
          { selected: true, value: '5' }
        ]
      }
    };
    const type = 'Array[Int]';
    const result = getExtraAttributeValue(evt, type);
    expect(result).toEqual([1, 2, 5]);
  });
});
