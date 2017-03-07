import { isNumberInRange, isDecimalNumber } from '../validators';

describe('validators', () => {
  describe('isNumberInRange', () => {
    it('should accept number within range', () => {
      const error = isNumberInRange(1,3)('test')(2);
      expect(error).toBe(undefined);
    });

    it('should reject number outside range', () => {
      const error = isNumberInRange(1,3)('test')(-20000);
      expect(error).toBe('test must be a number in range 1 - 3');
    });

    it('should accept number within range with from below zero', () => {
      const error = isNumberInRange(-1000,3)('test')(-30);
      expect(error).toBe(undefined);
    });
  });

  describe('isDecimalNumber', () => {
    it('should accept number without decimal points', () =>  {
      const error = isDecimalNumber(0, 3)('test')('4');
      expect(error).toBe(undefined);
    });

    it('should accept number with decimal points', () =>  {
      const error = isDecimalNumber(0, 3)('test')('4,333');
      expect(error).toBe(undefined);
    });

    it('should reject number with too many decimal points', () =>  {
      const error = isDecimalNumber(0, 3)('test')('4,3333');
      expect(error).toBe('test must be a decimal number');
    });

    it('should accept negative number with decimal points', () =>  {
      const error = isDecimalNumber(0, 3)('test')('-4,333');
      expect(error).toBe(undefined);
    });

    it('should accept negative number without decimal points', () =>  {
      const error = isDecimalNumber(0, 3)('test')('-4');
      expect(error).toBe(undefined);
    });
  });
});