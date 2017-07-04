// @flow

declare var describe: any;
declare var it: any;
declare var expect: any;

import startWith from 'lodash/startsWith';
import {
  getResultHeadersForType,
  getHeadersForType,
  appendResultValuesToBase
} from '../exchangeTemplate';

describe('exchangeTemplate', () => {
  describe('headers', () => {
    const resultHeadersTestSuite = suite =>
      describe(suite.type, () => {
        const baseHeaderSize = 11 + suite.resultCount;

        it('should have base headers size of ' + baseHeaderSize, () => {
          const res = getHeadersForType(suite.type);
          expect(res).toHaveLength(baseHeaderSize);
        });

        it('should have result headers size of ' + suite.resultCount, () => {
          const res = getResultHeadersForType(suite.type);
          expect(res).toHaveLength(suite.resultCount);
        });

        it('should prefix result headers with result', () => {
          const res = getResultHeadersForType(suite.type);
          res.forEach(r => expect(r).toMatch(/^result.*/));
        });
      });

    [
      { type: 'GenericResult', resultCount: 2 },
      { type: 'AgeResult', resultCount: 3 },
      { type: 'RadioCarbonResult', resultCount: 4 },
      { type: 'MeasurementResult', resultCount: 8 },
      { type: 'ExtractionResult', resultCount: 7 }
    ].forEach(resultHeadersTestSuite);
  });

  describe('result', () => {
    const resultKeys = suite => {
      const base = {
        type: 'analysis',
        analysisId: 12,
        objectId: null,
        museumNo: null,
        subNo: null,
        arkFindingNo: null,
        term: null,
        sampleObjectId: null,
        sampleNum: null,
        sampleId: null,
        sampleType: null
      };

      describe(suite.type, () => {
        'use strict';
        it('should have base keys of 11', () => {
          const res = appendResultValuesToBase(base, suite.type);
          const keys = Object.keys(res);
          const baseKeys = keys.filter(k => !startWith(k, 'result'));

          expect(baseKeys).toHaveLength(11);
        });

        it('should have result keys of ' + suite.type, () => {
          const res = appendResultValuesToBase(base, suite.type);
          const keys = Object.keys(res);
          const resultKeys = keys.filter(k => startWith(k, 'result'));

          expect(resultKeys).toHaveLength(suite.resultCount);
        });
      });
    };

    [
      { type: 'GenericResult', resultCount: 2 },
      { type: 'AgeResult', resultCount: 3 },
      { type: 'RadioCarbonResult', resultCount: 4 },
      { type: 'MeasurementResult', resultCount: 8 },
      { type: 'ExtractionResult', resultCount: 7 }
    ].forEach(resultKeys);
  });
});
