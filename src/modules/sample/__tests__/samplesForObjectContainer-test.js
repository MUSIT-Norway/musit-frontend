import { onMount } from '../samplesForObjectContainer';
import { AppSession } from '../../app/appSession';
import MuseumId from '../../../models/museumId';
import CollectionId from '../../../models/collectionId';
import sinon from 'sinon';

describe('samplesForObjectContainer', () => {
  it('should have a working onMount', () => {
    const loadSamplesForObject = sinon.spy();
    const data = {
      data: [
        {
          createdDate: '1992-01-01',
          sampleType: 'Vev',
          sampleSubType: 'Blod',
          status: 1
        },
        {
          createdDate: '1956-01-01',
          sampleType: 'Tekstil',
          sampleSubType: 'Ull',
          status: 2
        }
      ],
      museumNo: 'MUS-1',
      subNo: 'AAA',
      term: 'Carex'
    };

    const props = {
      appSession: new AppSession({
        museumId: new MuseumId(99),
        collectionId: new CollectionId('1234567'),
        accessToken: '1234',
      }),
      params: {parentId: '12344'},
      sampleStore: data,
      loadSamplesForObject,
    };
    onMount(props);
    expect(loadSamplesForObject.callCount).toBe(1);
    expect(loadSamplesForObject.getCall(0).args[0].token).toBe('1234');
    expect(loadSamplesForObject.getCall(0).args[0].objectId).toBe('12344');
    expect(loadSamplesForObject.getCall(0).args[0].museumId).toEqual(new MuseumId(99));

  });
});