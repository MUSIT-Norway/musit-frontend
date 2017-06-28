import { onMount } from '../sampleAddContainer';
import sinon from 'sinon';
import { appSession } from '../../../testutils/sampleDataForTest';

describe('SampleAddContainer', () => {
  describe('onMount', () => {
    it('should call loadObject since objectId is defined', () => {
      const loadObject = sinon.spy();
      const match = {
        params: { objectId: 1 }
      };
      onMount({ appSession, loadObject, match });
      expect(loadObject.calledOnce).toBe(true);
    });
  });
});
