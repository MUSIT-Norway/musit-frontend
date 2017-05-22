export const booleanMapper = {
  fromRaw: (s: ?boolean) => s,
  toRaw: (s: ?any) => !!s
};

export const stringMapper = {
  fromRaw: (s: ?string) => s,
  toRaw: (s: ?any) => (s ? '' + s : null)
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
