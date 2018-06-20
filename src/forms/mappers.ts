import { Maybe, Star, TODO } from '../types/common';

export const booleanMapper = {
  fromRaw: (s: Maybe<boolean>) => s,
  toRaw: (s: Maybe<Star>) => !!s
};

export const stringMapper = {
  fromRaw: (s: Maybe<string>) => s,
  toRaw: (s: Maybe<Star>) => (s ? '' + s : null)
};

export const noMapper = {
  fromRaw: (s: Maybe<TODO>) => s,
  toRaw: (s: Maybe<TODO>) => s
};

export const numberMapper = {
  fromRaw: (s: Maybe<string>) => {
    if (!s) {
      return null;
    }
    return parseFloat(s.replace(/,/g, '.'));
  },
  toRaw: (s: Maybe<number>) => {
    if (!s) {
      return null;
    }
    return (s < 0 ? '-' : '') + ('' + s).replace(/\./g, ',');
  }
};
