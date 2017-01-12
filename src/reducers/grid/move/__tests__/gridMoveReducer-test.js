import * as actions from '../../../../reducers/grid/move/index';
import reducer from '../../../../reducers/grid/move/index';
import Config from '../../../../config';
import request from 'superagent';
import nocker from 'superagent-nock';
import MuseumId from '../../../../models/museumId';

const nock = nocker(request);

describe('GridMoveHistory', () => {
  it('creates LOAD_SUCCESS when fetching data has been done', () => {
    const OutputSuccess = [
      {
        doneDate: '2016-10-06T00:00:00+00:00',
        registeredBy: '00000000-0000-0000-0000-000000000000',
        registeredDate: '2016-10-06T05:55:52+00:00',
        from: {
          path: ',1,2,3,6,7,',
          pathNames: [
            {
              name: 'root-node',
              nodeId: 1
            },
            {
              name: 'Utviklingsmuseet',
              nodeId: 2
            },
            {
              name: 'Forskningens hus',
              nodeId: 3
            },
            {
              name: 'Forskningsværelset',
              nodeId: 6
            },
            {
              name: 'Foo',
              nodeId: 7
            }
          ]
        },
        to: {
          path: ',1,2,3,6,',
          pathNames: [
            {
              name: 'root-node',
              nodeId: 1
            },
            {
              name: 'Utviklingsmuseet',
              nodeId: 2
            },
            {
              name: 'Forskningens hus',
              nodeId: 3
            },
            {
              name: 'Forskningsværelset',
              nodeId: 6
            }
          ]
        }
      },
      {
        doneBy: 'ee8d5b67-d173-46b2-9918-e06a9729825f',
        doneDate: '2016-10-06T00:00:00+00:00',
        registeredBy: '00000000-0000-0000-0000-000000000000',
        registeredDate: '2016-10-06T05:55:52+00:00',
        from: {
          path: ',1,2,3,6,7,',
          pathNames: [
            {
              name: 'root-node',
              nodeId: 1
            },
            {
              name: 'Utviklingsmuseet',
              nodeId: 2
            },
            {
              name: 'Forskningens hus',
              nodeId: 3
            },
            {
              name: 'Forskningsværelset',
              nodeId: 6
            },
            {
              name: 'Foo',
              nodeId: 7
            }
          ]
        },
        to: {
          path: ',1,2,3,6,',
          pathNames: [
            {
              name: 'root-node',
              nodeId: 1
            },
            {
              name: 'Utviklingsmuseet',
              nodeId: 2
            },
            {
              name: 'Forskningens hus',
              nodeId: 3
            },
            {
              name: 'Forskningsværelset',
              nodeId: 6
            }
          ]
        }
      }
    ];
    const id = 1;
    const url = `${Config.magasin.urls.storagefacility.baseUrl(new MuseumId(99))}/objects/${id}/locations`;
    nock('http://localhost')
      .get(url)
      .reply(200, OutputSuccess);

    const actorUrl = `${Config.magasin.urls.actor.baseUrl}/details`;
    nock('http://localhost')
      .post(actorUrl, ['ee8d5b67-d173-46b2-9918-e06a9729825f'])
      .reply(200, [{fn: 'Test user', dataportenId: 'ee8d5b67-d173-46b2-9918-e06a9729825f'}]);

    const store = mockStore();

    return store.dispatch(actions.loadMoveHistoryForObject(1, new MuseumId(99)))
      .then(() => {
        expect(store.getActions()).toMatchSnapshot();
      });
  });

  it('Move history: no action', () => {
    expect(
      reducer(undefined, {})
    ).toMatchSnapshot();
  });

  it('Move history: initial action', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD
      })
    ).toMatchSnapshot();
  });

  it('Move history: success action', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD_SUCCESS,
        result: [
          {
            to: {
              id: 3,
              name: 'Test 1',
              path: ',1,2,3,',
              pathNames: [
                {
                  nodeId: 1,
                  name: 'Museum 1'
                },
                {
                  nodeId: 2,
                  name: 'Building 1'
                },
                {
                  nodeId: 3,
                  name: 'Room 1'
                }
              ]
            },
            from: {
              id: 4,
              name: 'Test 2',
              path: ',1,2,4,',
              pathNames: [
                {
                  nodeId: 1,
                  name: 'Museum 1'
                },
                {
                  nodeId: 2,
                  name: 'Building 1'
                },
                {
                  nodeId: 4,
                  name: 'Room 4'
                }
              ]
            }
          }
        ]
      })
    ).toMatchSnapshot();
  });

  it('Move history: fail action', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD_FAIL,
        error: Error('Some error to load history data.')
      })
    ).toMatchSnapshot();
  });

  it('CLEAR_SUCCESS action', () => {
    expect(
      reducer({
        data: [
          {
            doneBy: 2,
            doneDate: '2016-10-06T00:00:00+00:00',
            registeredBy: 'Darth Vader',
            registeredDate: '2016-10-06T05:55:52+00:00',
            from: {
              path: ',1,2,3,6,7,',
              pathNames: [
                {
                  name: 'root-node',
                  nodeId: 1
                },
                {
                  name: 'Utviklingsmuseet',
                  nodeId: 2
                },
                {
                  name: 'Forskningens hus',
                  nodeId: 3
                },
                {
                  name: 'Forskningsværelset',
                  nodeId: 6
                },
                {
                  name: 'Foo',
                  nodeId: 7
                }
              ]
            },
            to: {
              path: ',1,2,3,6,',
              pathNames: [
                {
                  name: 'root-node',
                  nodeId: 1
                },
                {
                  name: 'Utviklingsmuseet',
                  nodeId: 2
                },
                {
                  name: 'Forskningens hus',
                  nodeId: 3
                },
                {
                  name: 'Forskningsværelset',
                  nodeId: 6
                }
              ]
            }
          }]
      }, actions.clearMoveHistoryForObject())
    ).toMatchSnapshot();
  });

});