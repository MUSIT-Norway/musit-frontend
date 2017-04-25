import type { Phone } from './types';

export const booleanMapper = {
  fromRaw: (s: ?boolean) => s,
  toRaw: (s: ?any) => !!s
};

export const stringMapper = {
  fromRaw: (s: ?string) => s,
  toRaw: (s: ?any) => s ? '' + s : null
};

export const noMapper = {
  fromRaw: (s: ?any) => s,
  toRaw: (s: ?any) => s
};

export const numberMapper = {
  fromRaw: (s: ?string) => {
    if (!s) {
      return null;
    }
    return parseFloat(s.replace(/,/g, '.'));
  },
  toRaw: (s: ?number) => {
    if (!s) {
      return null;
    }
    return (s < 0 ? '-' : '') + ('' + s).replace(/\./g, ',');
  }
};

export const specialPhoneMapper = {
  fromRaw: (s: ?string): Phone => {
    if (!s) {
      return null;
    }
    const arr = s.split('-');
    return {
      ext: arr[0] * 1,
      num: arr[1] * 1
    };
  },
  toRaw: (s: ?Phone): string => {
    if (!s) {
      return null;
    }
    return s.ext + '-' + s.num;
  }
};
