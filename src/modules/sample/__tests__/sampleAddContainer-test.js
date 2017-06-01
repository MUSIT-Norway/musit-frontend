import { onMount } from '../sampleAddContainer';
import sinon from 'sinon';
import { appSession } from '../../../testutils/sampleDataForTest';

describe('SampleAddContainer', () => {
  describe('onMount', () => {
    it('should call getPredefinedTypes', () => {
      const getPredefinedTypes = sinon.spy();
      onMount({ appSession, getPredefinedTypes });
      expect(getPredefinedTypes.calledOnce).toBe(true);
    });
  });
});
