// @flow

import { arrayBufferToBinaryString, stringToArrayBuffer } from '../arrayBufferHelper';

declare var describe: any;
declare var it: any;
declare var expect: any;

describe('arrayBufferHelper', () => {
  it('should convert from string to array buffer and back again', () => {
    const origin = 'This is a cool text';

    const ab = stringToArrayBuffer(origin);
    const result = arrayBufferToBinaryString(ab);

    expect(result).toEqual(origin);
  });
});
