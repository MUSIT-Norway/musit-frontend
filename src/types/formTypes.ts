// @flow

export type ValueType = string | number | boolean | Array<*>;
export type RawValue = ValueType | { [string]: ValueType };

export type Field<T> = {
  name: string,
  rawValue?: ?RawValue,
  defaultValue: ?T,
  value?: ?T,
  status?: {
    valid: boolean,
    error?: ?string
  },
  mapper: {
    fromRaw: (s: ?RawValue) => ?T,
    toRaw: (t: ?T) => ?RawValue
  },
  validator: {
    rawValidator?: ?(field: string) => (s: ?RawValue) => ?string,
    valueValidator?: ?(field: string) => (t: ?T) => ?string
  }
};
