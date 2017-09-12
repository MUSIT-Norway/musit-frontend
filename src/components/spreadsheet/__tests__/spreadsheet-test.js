// @flow
import { binaryWorksheetToJson, jsonToWorksheetBinary } from '../spreadsheet';

describe('spreadsheet', () => {
  it('should create a binary worksheet and read it back again to json with default headers', () => {
    const content = [{ name: 'Ola', age: '42' }, { name: 'Kari', age: '42' }];

    const binary = jsonToWorksheetBinary(content);
    const result = binaryWorksheetToJson(binary);

    expect(result).toEqual(content);
  });

  it('should create a binary worksheet and read it back again to json with custom headers', () => {
    const content = [{ name: 'Ola', age: '42' }, { name: 'Kari', age: '42' }];

    const binary = jsonToWorksheetBinary(content);
    const result = binaryWorksheetToJson(binary, ['navn', 'alder']);

    expect(result).toEqual([{ navn: 'Ola', alder: '42' }, { navn: 'Kari', alder: '42' }]);
  });
});
