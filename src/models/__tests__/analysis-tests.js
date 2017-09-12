// @flow
import { extractResponseArray } from '../analysis/analysis';

describe('Analysis model', () => {
  describe('extractResponseArray', () => {
    it('should convert responses with no content (http 204) to empty array', () => {
      const result = extractResponseArray({ status: 204, response: null });

      expect(result).toEqual([]);
    });

    it('should pass trough 200 responses', () => {
      const content = ['a response'];
      const result = extractResponseArray({ status: 200, response: content });

      expect(result).toEqual(content);
    });
  });
});
