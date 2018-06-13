import { Star, Maybe, RemoveMaybe } from "./common";

// @flow

export type ValueType = string | number | boolean | Array<Star>;
export type RawValue = ValueType | { [key: string]: ValueType };

export type Field<T> = {
  name: string;
  rawValue?: Maybe<RawValue>;
  defaultValue: Maybe<T>;
  value?: Maybe<T>;
  status?: {
    valid: boolean;
    error?: Maybe<string>;
  };
  mapper: {
    fromRaw: (s: Maybe<RawValue>) => Maybe<T>;
    toRaw: (t: Maybe<T>) => Maybe<RawValue>;
  };
  validator: {
    rawValidator?: RemoveMaybe<(field: string) => (s: Maybe<RawValue>) => Maybe<string>>;
    valueValidator?: RemoveMaybe<(field: string) => (t: Maybe<T>) => Maybe<string>>;
  };
};
