// @flow
import { containsAttributes } from '../getters';
declare var describe: any;
declare var it: any;
declare var expect: any;

describe('getters', () => {
  describe('containsAttributes', () => {
    it('should return false for empty objects', () => {
      expect(containsAttributes({}, null)).toEqual(false);
    });
    it('should return false for extra attributes object with falsy values', () => {
      expect(containsAttributes({ key1: '', key2: '' }, null)).toEqual(false);
    });
    it('should return true if there is existing values from backend', () => {
      expect(
        containsAttributes({ key1: '', key2: '' }, { key3: '', type: 'SomeType' })
      ).toEqual(true);
    });
    it('should return true if there is existing values from backend and no changes', () => {
      expect(containsAttributes({}, { key3: '', type: 'SomeType' })).toEqual(true);
    });
    it('should return true if there is an actual change', () => {
      expect(
        containsAttributes({ key3: 'Some new value' }, { key3: '', type: 'SomeType' })
      ).toEqual(true);
    });
  });
});
