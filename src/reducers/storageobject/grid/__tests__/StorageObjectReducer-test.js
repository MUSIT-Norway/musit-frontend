import * as actions from '../index';
import reducer from '../index';
import request from 'superagent';
import nocker from 'superagent-nock';
const nock = nocker(request);
import Config from '../../../../config';
import MuseumId from '../../../../models/museumId';
import CollectionId from '../../../../models/collectionId';

const comingFromBackend = {
  totalMatches: 3,
  matches: [
    {
      id: 1,
      identifier: {
        museumNo: 'C666',
        subNo: '34'
      },
      displayName: 'Øks'
    },
    {
      id: 2,
      identifier: {
        museumNo: 'C666',
        subNo: '31'
      },
      displayName: 'Sverd'
    },
    {
      id: 3,
      identifier: {
        museumNo: 'C666',
        subNo: '38'
      },
      displayName: 'Sommerfugl'
    }
  ]
};

describe('StorageUnitReducer', () => {
  it('creates LOAD_SEVERAL_SUCCESS when fetching data has been done', () => {
    const id = 1;
    const url = `${Config.magasin.urls.thingaggregate.baseUrl(new MuseumId(99))}/node/${id}/objects?collectionIds=ddfggggg&page=1&limit=25`;
    nock('http://localhost')
        .get(url)
        .reply(200, comingFromBackend);
    const store = mockStore();

    return store.dispatch(actions.loadObjects(id, new MuseumId(99), new CollectionId('ddfggggg')))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
  });

  it('no action', () => {
    expect(
        reducer(undefined, undefined)
    ).toMatchSnapshot();
  });

  it('initial action', () => {
    expect(
        reducer(undefined, {
          type: actions.LOAD_SEVERAL
        })
    ).toMatchSnapshot();
  });

  it('success action', () => {
    expect(
        reducer(undefined, {
          type: actions.LOAD_SEVERAL_SUCCESS,
          result: {
            totalMatches: 1,
            matches: [
              {
                id: 1,
                term: 'Fugl',
                museumNo: 'CH500',
                subNo: '5'
              }
            ]
          }
        })
    ).toMatchSnapshot();
  });

  it('fail action', () => {
    expect(
        reducer(undefined, {
          type: actions.LOAD_SEVERAL_FAIL,
          error: Error('Some error here.')
        })
    ).toMatchSnapshot();
  });

});
