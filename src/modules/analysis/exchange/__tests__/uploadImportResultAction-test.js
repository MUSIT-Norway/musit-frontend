// @flow

declare var describe: any;
declare var it: any;
declare var expect: any;

import { createRequest, mapToAnalysisResult } from '../uploadImportResultAction';

describe('uploadImportResultAction', () => {
  const analysisRow = {
    type: 'analysis',
    analysisId: 11,
    objectId: null,
    affectedThing: null,
    museumNo: null,
    subNo: null,
    arkFindingNo: null,
    term: null,
    sampleObjectId: null,
    sampleNum: null,
    sampleId: null,
    sampleType: null,
    resultExternalRef: 'col-ref',
    resultComment: 'col-com'
  };

  const sampleRow = {
    type: 'sample',
    analysisId: 12,
    objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
    affectedThing: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
    museumNo: null,
    subNo: null,
    arkFindingNo: null,
    term: null,
    sampleObjectId: null,
    sampleNum: null,
    sampleId: null,
    sampleType: null,
    resultExternalRef: 'sam-ref',
    resultComment: 'sam-com'
  };

  it('should create valid request', () => {
    const res = createRequest('GenericResult', [analysisRow, sampleRow]);

    expect(res).toEqual({
      collectionResult: {
        type: 'GenericResult',
        extRef: ['col-ref'],
        comment: 'col-com'
      },
      objectResults: [
        {
          objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
          eventId: 12,
          result: { type: 'GenericResult', extRef: ['sam-ref'], comment: 'sam-com' }
        }
      ]
    });
  });

  describe('mapToAnalysisResult', () => {
    it('should map to generic result with result values', () => {
      const res = mapToAnalysisResult('GenericResult', {
        type: 'sample',
        analysisId: 12,
        objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
        museumNo: null,
        subNo: null,
        arkFindingNo: null,
        term: null,
        sampleObjectId: null,
        sampleNum: null,
        sampleId: null,
        sampleType: null,
        resultExternalRef: 'sam-ref',
        resultComment: 'sam-com'
      });
      expect(res).toEqual({
        type: 'GenericResult',
        extRef: ['sam-ref'],
        comment: 'sam-com'
      });
    });

    it('should map to generic result without result values', () => {
      const res = mapToAnalysisResult('GenericResult', {
        type: 'sample',
        analysisId: 12,
        objectId: '12080e3e-2ca2-41b1-9d4a-4d72e292dcd8',
        museumNo: null,
        subNo: null,
        arkFindingNo: null,
        term: null,
        sampleObjectId: null,
        sampleNum: null,
        sampleId: null,
        sampleType: null,
        resultExternalRef: null,
        resultComment: null
      });
      expect(res).toEqual({ type: 'GenericResult', extRef: null, comment: null });
    });
  });
});
