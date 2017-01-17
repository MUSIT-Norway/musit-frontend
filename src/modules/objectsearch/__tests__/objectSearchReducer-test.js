import * as actions from '../actions';
import * as constants from '../constants';
import reducer from '../reducer';
import Config from '../../../config';
import request from 'superagent';
import nocker from 'superagent-nock';
import MuseumId from '../../../shared/models/museumId';
import CollectionId from '../../../shared/models/collectionId';

const nock = nocker(request);

describe('Object search reducer', () => {
  it('creates SEARCH_OBJECTS_SUCCESS when fetching data has been done', () => {
    const params = {
      museumNo: '',
      subNo: '',
      term: ''
    };
    const page = {
      page: 1,
      perPage: 50
    };
    const baseUrl = `${Config.magasin.urls.thingaggregate.baseUrl(new MuseumId(99))}/objects/search`;
    const museumNoQuery = `museumNo=${params.museumNo || ''}`;
    const subNoQuery = `subNo=${params.subNo || ''}`;
    const termQuery = `term=${params.term || ''}`;
    const pageQuery = `page=${page}`;
    const limitQuery = `limit=${params.perPage}`;
    const collectionIds = 'collectionIds=ddddfg';
    const url = `${baseUrl}?${museumNoQuery}&${subNoQuery}&${termQuery}&${pageQuery}&${limitQuery}&${collectionIds}`;
    nock('http://localhost')
      .get(url)
      .reply(200, {
        totalMatches: 1,
        matches: [
          {
            id: 51,
            museumNo: 'MusN11',
            term: 'Solsikke'
          }
        ]
      });
    const store = mockStore();

    return store.dispatch(actions.searchForObjects(params, page, new MuseumId(99), new CollectionId('ddddfg')))
      .then(() => {
        expect(store.getActions()).toMatchSnapshot();
      });
  });

  it('search objects: no action', () => {
    expect(
      reducer(undefined, {})
    ).toMatchSnapshot();
  });

  it('search objects: initial action', () => {
    expect(
      reducer(undefined, {
        type: constants.SEARCH_OBJECTS
      })
    ).toMatchSnapshot();
  });

  it('search objects: success action', () => {
    expect(
      reducer(undefined, {
        type: constants.SEARCH_OBJECTS_SUCCESS,
        result: {
          'totalMatches': 55,
          'matches': [
            {
              'id': 51,
              'museumNo': 'MusN11',
              'term': 'Solsikke',
              'currentLocationId': 5,
              'path': ',1,2,3,4,5,',
              'pathNames': [
                {
                  'nodeId': 1,
                  'name': 'root-node'
                },
                {
                  'nodeId': 2,
                  'name': 'Utviklingsmuseet'
                },
                {
                  'nodeId': 3,
                  'name': 'Forskningens hus'
                },
                {
                  'nodeId': 4,
                  'name': 'Kulturværelset'
                },
                {
                  'nodeId': 5,
                  'name': 'Naturværelset'
                }
              ]
            },
            {
              'id': 54,
              'museumNo': 'MusN13',
              'term': 'Makrellsopp'
            },
            {
              'id': 19,
              'museumNo': 'MusN20',
              'term': 'Ukjent mygg'
            },
            {
              'id': 17,
              'museumNo': 'MusN21',
              'subNo': '2',
              'term': 'Snilebille'
            },
            {
              'id': 18,
              'museumNo': 'MusN22',
              'term': 'Fluesopp'
            },
            {
              'id': 14,
              'museumNo': 'MusK23',
              'term': 'Lite skaft av ben'
            },
            {
              'id': 15,
              'museumNo': 'MusK24',
              'subNo': 'a',
              'term': 'Lendeklede'
            },
            {
              'id': 16,
              'museumNo': 'MusK24',
              'subNo': 'b',
              'term': 'Kokekar'
            },
            {
              'id': 9,
              'museumNo': 'MusN28',
              'term': 'Tusenben',
              'currentLocationId': 5,
              'path': ',1,2,3,4,5,',
              'pathNames': [
                {
                  'nodeId': 1,
                  'name': 'root-node'
                },
                {
                  'nodeId': 2,
                  'name': 'Utviklingsmuseet'
                },
                {
                  'nodeId': 3,
                  'name': 'Forskningens hus'
                },
                {
                  'nodeId': 4,
                  'name': 'Kulturværelset'
                },
                {
                  'nodeId': 5,
                  'name': 'Naturværelset'
                }
              ]
            }
          ]
        }
      })
    ).toMatchSnapshot();
  });

  it('search objects: fail action', () => {
    expect(
      reducer(undefined, {
        type: constants.SEARCH_OBJECTS_FAIL,
        error: Error('search objects has some error.')
      })
    ).toMatchSnapshot();
  });
});
  