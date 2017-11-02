// @flow

import queryParams from '../queryParams';

describe('queryParams', () => {
  it('empty object should be empty string', () => {
    const res = queryParams({});
    expect(res).toEqual('');
  });

  it('object with null value should be empty string', () => {
    const res = queryParams({ k: null });
    expect(res).toEqual('');
  });

  it('object with undefined value should be empty string', () => {
    const res = queryParams({ k: undefined });
    expect(res).toEqual('');
  });

  it('only include key with values', () => {
    const res = queryParams({
      u: undefined,
      v: 123,
      n: null
    });
    expect(res).toEqual('?v=123');
  });

  it('should not encode comma', () => {
    const res = queryParams({
      u: undefined,
      v: [123, 'kaare', 'foo $1'],
      n: null
    });
    expect(res).toEqual('?v=123,kaare,foo%20%241');
  });

  it('support multiple values and types', () => {
    const res = queryParams({
      num: 123,
      str: 'foo'
    });
    expect(res).toEqual('?num=123&str=foo');
  });

  it('encode string values with special chars', () => {
    const res = queryParams({
      str: 'foo $1'
    });
    expect(res).toEqual('?str=foo%20%241');
  });
});
