import {
  validKeysForNumberRange,
  removeInvalidKeysForNumberRange,
  removeInvalidKeysForNumberRangeString,
  validateNumberRangeField
} from '../validation';

describe('check key for number range field', () => {
  it('should be true for numbers only and dots', () => {
    expect(validKeysForNumberRange('1')).toBe(true);
    expect(validKeysForNumberRange('2')).toBe(true);
    expect(validKeysForNumberRange('3')).toBe(true);
    expect(validKeysForNumberRange('4')).toBe(true);
    expect(validKeysForNumberRange('5')).toBe(true);
    expect(validKeysForNumberRange('6')).toBe(true);
    expect(validKeysForNumberRange('7')).toBe(true);
    expect(validKeysForNumberRange('8')).toBe(true);
    expect(validKeysForNumberRange('9')).toBe(true);
    expect(validKeysForNumberRange('0')).toBe(true);
    expect(validKeysForNumberRange('.')).toBe(true);
  });

  it('should be false for any other then numbers and dots', () => {
    expect(validKeysForNumberRange('a')).toBe(false);
    expect(validKeysForNumberRange('B')).toBe(false);
    expect(validKeysForNumberRange('-')).toBe(false);
  });
});

describe('removeInvalidKeysForNumberRange', () => {
  it('should be null for any other then numbers and dots', () => {
    expect(removeInvalidKeysForNumberRange('1')).toBe('1');
    expect(removeInvalidKeysForNumberRange('2')).toBe('2');

    expect(removeInvalidKeysForNumberRange('0')).toBe('0');
    expect(removeInvalidKeysForNumberRange('.')).toBe('.');
    expect(removeInvalidKeysForNumberRange('a')).toBe('');
    expect(removeInvalidKeysForNumberRange('B')).toBe('');
    expect(removeInvalidKeysForNumberRange('-')).toBe('');
  });
});

describe('removeInvalidKeysForNumberRangeString', () => {
  it('should remove any other then numbers and dots from input field', () => {
    expect(removeInvalidKeysForNumberRangeString('1')).toBe('1');
    expect(removeInvalidKeysForNumberRangeString('2')).toBe('2');
    expect(removeInvalidKeysForNumberRangeString('0')).toBe('0');
    expect(removeInvalidKeysForNumberRangeString('.')).toBe('.');
    expect(removeInvalidKeysForNumberRangeString('a')).toBe('');
    expect(removeInvalidKeysForNumberRangeString('B')).toBe('');
    expect(removeInvalidKeysForNumberRangeString('-')).toBe('');
    expect(removeInvalidKeysForNumberRangeString('12-..45')).toBe('12..45');
    expect(removeInvalidKeysForNumberRangeString('Mus12-..Mus45')).toBe('12..45');
    expect(removeInvalidKeysForNumberRangeString('Mus12-....34')).toBe('12....34');
    expect(removeInvalidKeysForNumberRangeString('19-2..5')).toBe('192..5');

    expect(removeInvalidKeysForNumberRangeString('')).toBe('');
    expect(removeInvalidKeysForNumberRangeString(null)).toBe('');
    expect(removeInvalidKeysForNumberRangeString(undefined)).toBe('');
  });
});

describe('validateNumberRangeField', () => {
  it('Shuld be true for 12..13 format', () => {
    expect(validateNumberRangeField('12..13')).toBe(true);
  });
  it('Shuld be true for ..13 format', () => {
    expect(validateNumberRangeField('..13')).toBe(true);
  });
  it('Shuld be true for 12.. format', () => {
    expect(validateNumberRangeField('12..')).toBe(true);
  });
  it('Shuld be true for .. format', () => {
    expect(validateNumberRangeField('..')).toBe(true);
  });
  it('Shuld be true for 12 format', () => {
    expect(validateNumberRangeField('12')).toBe(true);
  });
  it('Shuld be true for "" format', () => {
    expect(validateNumberRangeField('')).toBe(true);
  });
  it('Shuld be true for null format', () => {
    expect(validateNumberRangeField(null)).toBe(true);
  });

  it('Shuld be true for undefined format', () => {
    expect(validateNumberRangeField(undefined)).toBe(true);
  });

  it('Shuld be false for 12..13AV format', () => {
    expect(validateNumberRangeField('12..13AV')).toBe(false);
  });

  it('Shuld be false for 12..13.. format', () => {
    expect(validateNumberRangeField('12..13..')).toBe(false);
  });
  it('Shuld be false for 12..13..14 format', () => {
    expect(validateNumberRangeField('12..13..14')).toBe(false);
  });

  it('Shuld be false for 12....13 format', () => {
    expect(validateNumberRangeField('12....13')).toBe(false);
  });
  it('Shuld be false for 12aa13 format', () => {
    expect(validateNumberRangeField('12aa13')).toBe(false);
  });
  it('Shuld be false for a1213 format', () => {
    expect(validateNumberRangeField('a1213')).toBe(false);
  });
  it('Shuld be false for 12..,13 format', () => {
    expect(validateNumberRangeField('12..,13')).toBe(false);
  });

  it('Shuld be false for 19-2..5 format', () => {
    expect(validateNumberRangeField('19-2..5')).toBe(false);
  });
});
