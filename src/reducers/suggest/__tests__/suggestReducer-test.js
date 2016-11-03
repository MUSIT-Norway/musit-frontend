import * as actions from '../index';
import reducer from '../index';
import request from 'superagent';
import nocker from 'superagent-nock';
const nock = nocker(request);

describe('Suggest reducer', () => {
  it('address SUGGEST_SUCCESS when fetching data has been done', () => {
    const query = 'oslo';
    const destination = 'search';
    const getData = [
      {
        street: 'Oscarshallveien',
        streetNo: 13,
        place: 'OSLO',
        zip: 287
      }
    ];
    const url = `/api/geolocation/v1/address?search=[${query}]`;
    nock('http://localhost')
            .get(url)
            .reply(200, getData);
    const store = mockStore();

    return store.dispatch(actions.suggestAddress(destination, query))
            .then(() => {
              expect(store.getActions()).toMatchSnapshot();
            });
  });

  it('address: no action', () => {
    expect(
            reducer(undefined, undefined)
        ).toMatchSnapshot();
  });

  it('address: initial action', () => {
    expect(
            reducer(undefined, {
              type: actions.SUGGEST
            })
        ).toMatchSnapshot();
  });

  it('address: success action', () => {
    expect(
            reducer(undefined, {
              type: actions.SUGGEST_SUCCESS,
              result: {
                someField: 1
              }
            })
        ).toMatchSnapshot();
  });

  it('address: fail action', () => {
    expect(
            reducer(undefined, {
              type: actions.SUGGEST_FAIL,
              error: Error('address has some error.')
            })
        ).toMatchSnapshot();
  });

  it('node SUGGEST_SUCCESS when fetching data has been done', () => {
    const query = 'Str=test';
    const destination = 'search';
    const getData = [
      {
        id:7,
        name: 'test',
        isPartOf: 3,
        groupRead: 'foo',
        path: ',1,2,3,7,',
        type: 'Room',
        updatedBy: 123,
        updatedDate: '2016-10-24T12:07:21+00:00'
      },
      {
        id: 10,
        name: 'test',
        isPartOf: 7,
        groupRead: 'foo',
        path: ',1,2,3,7,10,',
        type: 'Room',
        updatedBy: 123,
        updatedDate: '2016-10-24T16:12:46+00:00'
      }
    ];
    const url = `/api/storagefacility/v1/museum/1/storagenodes/search?searchStr=${query}`;
    nock('http://localhost')
            .get(url)
            .reply(200, getData);
    const store = mockStore();

    return store.dispatch(actions.suggestNode(destination, query))
            .then(() => {
              expect(store.getActions()).toMatchSnapshot();
            });
  });

  it('node: no action', () => {
    expect(
            reducer(undefined, undefined)
        ).toMatchSnapshot();
  });

  it('node: initial action', () => {
    expect(
            reducer(undefined, {
              type: actions.SUGGEST
            })
        ).toMatchSnapshot();
  });

  it('node: success action', () => {
    expect(
            reducer(undefined, {
              type: actions.SUGGEST_SUCCESS,
              result: {
                someField: 1
              }
            })
        ).toMatchSnapshot();
  });

  it('node: fail action', () => {
    expect(
            reducer(undefined, {
              type: actions.SUGGEST_FAIL,
              error: Error('node has some error.')
            })
        ).toMatchSnapshot();
  });


  it('person SUGGEST_SUCCESS when fetching data has been done', () => {
    const query = 'Jarle';
    const destination = 'search';
    const getData = [
      {
        id: 1,
        fn: 'Jarle Stabell',
        dataportenId: 'jarle'
      }
    ];
    const url = `/api/actor/v1/person?search=[${query}]&museumId=1`;
    nock('http://localhost')
            .get(url)
            .reply(200, getData);
    const store = mockStore();

    return store.dispatch(actions.suggestPerson(destination, query))
            .then(() => {
              expect(store.getActions()).toMatchSnapshot();
            });
  });

  it('person: no action', () => {
    expect(
            reducer(undefined, undefined)
        ).toMatchSnapshot();
  });

  it('person: initial action', () => {
    expect(
            reducer(undefined, {
              type: actions.SUGGEST
            })
        ).toMatchSnapshot();
  });

  it('person: success action', () => {
    expect(
            reducer(undefined, {
              type: actions.SUGGEST_SUCCESS,
              result: {
                someField: 1
              }
            })
        ).toMatchSnapshot();
  });

  it('person: fail action', () => {
    expect(
            reducer(undefined, {
              type: actions.SUGGEST_FAIL,
              error: Error('person has some error.')
            })
        ).toMatchSnapshot();
  });

  const initialState = {
    data: {
      someData: 1
    }
  };

  it('CLEAR action', () => {
    expect(
            reducer(initialState, actions.clearSuggest('Search'))
        ).toMatchSnapshot();
  });

  it('CLEAR without destination action', () => {
    expect(
            reducer(initialState, actions.clearSuggest())
        ).toMatchSnapshot();
  });
});
