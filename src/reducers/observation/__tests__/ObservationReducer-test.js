import assert from 'assert';
import observationReducer, {
  loadObservation,
  initialState
} from '../index';
import mapToFrontEnd from '../mapper/to_frontend';
import mapToBackEnd from '../mapper/to_backend';
import Actor from '../../../models/actor';
import configureMockStore from 'redux-mock-store';
import createMiddleware from '../../../middleware/clientMiddleware';
import ApiClient from '../../../middleware/ApiClient';
import Config from '../../../config';
import request from 'superagent';
import nocker from 'superagent-nock';
import reducer from '../../../reducers/observation/index';
import * as actions from '../../../reducers/observation/index';
import MuseumId from '../../../models/museumId';

const nock = nocker(request);
const middlewares = [createMiddleware(new ApiClient())];
const mockStore = configureMockStore(middlewares);


describe('ObservationReducer', () => {
  it('Initial state is set', () => {
    const state = observationReducer();
    assert(state === initialState);
  });

  it('load observation should update state', () => {
    const state = observationReducer(initialState, loadObservation(1, 2, new MuseumId(99)));
    assert(state.data.observations.length === 0);
  });

  it('mapToFrontEnd and mapToBackEnd shoud be inverse functions', () => {
    const frontEnd = {
      doneBy: new Actor({ id: '1', dataportenId: '8994945c-89a1-4086-b17a-728df8a907a4' }),
      doneDate: '2016-10-31T23:00:00.000Z',
      observations: [
        {
          type: 'hypoxicAir',
          data: {
            fromValue: '19',
            toValue: '23',
            commentValue: 'Test comments.'
          }
        },
        {
          type: 'lightCondition',
          data: {
            leftValue: 'Light',
            rightValue: 'Test comments.'
          }
        },
        {
          type: 'cleaning',
          data: {
            leftValue: 'Test cleaning value.',
            rightValue: 'Test comments.'
          }
        }
      ]
    };
    const backEnd = mapToBackEnd(frontEnd);
    expect(backEnd).toMatchSnapshot();
    const thereAndBackAgain = mapToFrontEnd(backEnd);
    expect(thereAndBackAgain).toMatchSnapshot();
  });

  it('Valid action from calling actor service for finding actor should update state correctly', () => {
    const actionResult = {
      data: {
        id: 1,
        fn: 'Arne And1'
      },
      type: 'LOAD_ACTOR_SUCCESS'
    };

    const state = observationReducer(initialState, actionResult);
    assert(state.type !== 'LOAD_ACTOR_SUCCESS' || state.data.fn === 'Arne And1');
  });

  it('test alcohol status: Uttørket', () => {
    const frontend = {
      doneBy: new Actor({ id: '1', dataportenId: '8994945c-89a1-4086-b17a-728df8a907a4' }),
      doneDate: '2016-10-31T23:00:00.000Z',
      observations: [
        {

          type: 'alcohol',
          data: {
            statusValue: 'Uttørket',
            volumeValue: '4',
            commentValue: 'Drita full'
          }
        }
      ]
    };
    const backEnd = mapToBackEnd(frontend);
    expect(backEnd).toMatchSnapshot();
    const thereAndBackAgain = mapToFrontEnd(backEnd);
    expect(thereAndBackAgain).toMatchSnapshot();
  });

  it('test alcohol status: nesten uttørket', () => {
    const frontend = {
      doneBy: new Actor({ id: '1', dataportenId: '8994945c-89a1-4086-b17a-728df8a907a4' }),
      doneDate: '2016-10-31T23:00:00.000Z',
      observations: [
        {

          type: 'alcohol',
          data: {
            statusValue: 'nesten uttørket',
            volumeValue: '4',
            commentValue: 'Drita full'
          }
        }
      ]
    };
    const backEnd = mapToBackEnd(frontend);
    expect(backEnd).toMatchSnapshot();
    const thereAndBackAgain = mapToFrontEnd(backEnd);
    expect(thereAndBackAgain).toMatchSnapshot();
  });

  it('test alcohol status: litt uttørket', () => {
    const frontend = {
      doneBy: new Actor({ id: '1', dataportenId: '8994945c-89a1-4086-b17a-728df8a907a4' }),
      doneDate: '2016-10-31T23:00:00.000Z',
      observations: [
        {

          type: 'alcohol',
          data: {
            statusValue: 'litt uttørket',
            volumeValue: '4',
            commentValue: 'Drita full'
          }
        }
      ]
    };
    const backEnd = mapToBackEnd(frontend);
    expect(backEnd).toMatchSnapshot();
    const thereAndBackAgain = mapToFrontEnd(backEnd);
    expect(thereAndBackAgain).toMatchSnapshot();
  });

  it('test alcohol status: noe uttørket', () => {
    const frontend = {
      doneBy: new Actor({ id: '1', dataportenId: '8994945c-89a1-4086-b17a-728df8a907a4' }),
      doneDate: '2016-10-31T23:00:00.000Z',
      observations: [
        {

          type: 'alcohol',
          data: {
            statusValue: 'noe uttørket',
            volumeValue: '4',
            commentValue: 'Drita full'
          }
        }
      ]
    };
    const backEnd = mapToBackEnd(frontend);
    expect(backEnd).toMatchSnapshot();
    const thereAndBackAgain = mapToFrontEnd(backEnd);
    expect(thereAndBackAgain).toMatchSnapshot();
  });

  it('test alcohol status: tilfredsstillende', () => {
    const frontend = {
      doneBy: new Actor({ id: '1', dataportenId: '8994945c-89a1-4086-b17a-728df8a907a4' }),
      doneDate: '2016-10-31T23:00:00.000Z',
      observations: [
        {

          type: 'alcohol',
          data: {
            statusValue: 'tilfredsstillende',
            volumeValue: '4',
            commentValue: 'Drita full'
          }
        }
      ]
    };
    const backEnd = mapToBackEnd(frontend);
    expect(backEnd).toMatchSnapshot();
    const thereAndBackAgain = mapToFrontEnd(backEnd);
    expect(thereAndBackAgain).toMatchSnapshot();

  });

  it('test invalid alcohol status', () => {
    const frontend = {
      doneBy: new Actor({ id: '1', dataportenId: '8994945c-89a1-4086-b17a-728df8a907a4' }),
      doneDate: '2016-10-31T23:00:00.000Z',
      observations: [
        {

          type: 'alcohol',
          data: {
            statusValue: 'xxxddudyudydydydydyd',
            volumeValue: '4',
            commentValue: 'Drita full'
          }
        }
      ]
    };
    const backEnd = mapToBackEnd(frontend);
    expect(backEnd).toMatchSnapshot();
    const thereAndBackAgain = mapToFrontEnd(backEnd);
    expect(thereAndBackAgain).toMatchSnapshot();
  });

  it('mapToFrontEnd and mapToBackEnd are inverse with complete data', () => {
    const frontend = {
      doneBy: new Actor({ id: '1', dataportenId: '8994945c-89a1-4086-b17a-728df8a907a4' }),
      doneDate: '2016-10-31T23:00:00.000Z',
      observations: [
        {

          type: 'lightCondition',
          data: {
            leftValue: 'Mørkst',
            rightValue: 'Altfor mørkt'
          }
        },
        {

          type: 'gas',
          data: {
            leftValue: 'Vannskade',
            rightValue: 'Altfor vått'
          }
        },
        {

          type: 'alcohol',
          data: {
            statusValue: 'Uttørket',
            volumeValue: '4',
            commentValue: 'Drita full'
          }
        },
        {

          type: 'mold',
          data: {
            leftValue: 'Muggent',
            rightValue: 'Altfor mye mugg'
          }
        },
        {

          type: 'cleaning',
          data: {
            leftValue: 'Urent',
            rightValue: 'Altfor lyst'
          }
        },
        {

          type: 'brannsikring',
          data: {
            leftValue: 'Brann',
            rightValue: 'Altfor vått'
          }
        },
        {

          type: 'skallsikring',
          data: {
            leftValue: 'skall',
            rightValue: 'Altfor skallet'
          }
        },
        {

          type: 'tyverisikring',
          data: {
            leftValue: 'Mye tyver',
            rightValue: 'Altfor mye tyver'
          }
        },
        {

          type: 'hypoxicAir',
          data: {
            fromValue: '1,4',
            toValue: '4,4',
            commentValue: 'Altfor fuktig'
          }
        },
        {

          type: 'relativeHumidity',
          data: {
            fromValue: '1,4',
            toValue: '4,4',
            commentValue: 'Altfor fuktig'
          }
        },
        {
          type: 'pest',
          data: {
            identificationValue: 'Mye skadedyr',
            commentValue: 'Ikke gjort noe med',
            observations: [
              {
                lifeCycle: 'Larva',
                count: '4'
              },
              {
                lifeCycle: 'Puppe',
                count: '32'
              }
            ]
          }
        },
        {
          type: 'vannskaderisiko',
          data: {
            leftValue: 'Vannskade',
            rightValue: 'Altfor vått'
          }
        },
        {
          type: 'temperature',
          data: {
            fromValue: '1,4',
            toValue: '4,4',
            commentValue: 'Altfor fuktig'
          }
        }
      ]
    };
    const backEnd = mapToBackEnd(frontend);
    expect(backEnd).toMatchSnapshot();
    const thereAndBackAgain = mapToFrontEnd(backEnd);
    expect(thereAndBackAgain).toMatchSnapshot();
  });


  it('creates LOAD_SUCCESS when observation data is loaded', () => {
    const nodeId = 2;
    const observationId = 3;
    const url = `${Config.magasin.urls.storagefacility.baseUrl(new MuseumId(99))}/${nodeId}/observations/${observationId}`;
    nock('http://localhost')
      .get(url)
      .reply(200, {
        id: 50,
        doneBy: '8994945c-89a1-4086-b17a-728df8a907a4',
        doneDate: '2016-09-29T00:00:00+00:00',
        affectedThing: 2,
        registeredBy: 'Darth Vader',
        registeredDate: '2016-10-17T14:22:39+00:00',
        eventType: 'Observation',
        gas: {
          gas: 'Gas test'
        }
      });

    const actorUrl = `${Config.magasin.urls.actor.baseUrl}/details`;
    nock('http://localhost')
      .post(actorUrl, ['8994945c-89a1-4086-b17a-728df8a907a4'])
      .reply(200, [{ fn: 'Test user', dataportenId: '8994945c-89a1-4086-b17a-728df8a907a4'}]);

    const store = mockStore();

    return store.dispatch(actions.loadObservation(2, 3, new MuseumId(99)))
      .then(() => {
        expect(store.getActions()).toMatchSnapshot();
      });
  });

  it('Observation no action', () => {
    expect(
      reducer(undefined, {})
    ).toMatchSnapshot();
  });

  it('Observation initial action', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD
      })
    ).toMatchSnapshot();
  });

  it('Observation success action', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD_SUCCESS,
        result: {
          doneBy: '7da64e83-7918-4cbb-8d81-f71e3ecdae67'
        }
      })
    ).toMatchSnapshot();
  });

  it('Observation fail action', () => {
    expect(
      reducer(undefined, {
        type: actions.LOAD_FAIL,
        error: Error('Some error occurred to load observation data.')
      })
    ).toMatchSnapshot();
  });

  it('creates ADD_SUCCESS when observation data is added', () => {
    const observationAddData = {
      doneBy: new Actor({ id: '1', dataportenId: '8994945c-89a1-4086-b17a-728df8a907a4' }),
      doneDate: '2016-10-31T23:00:00.000Z',
      observations: [
        {
          type: 'hypoxicAir',
          data: {
            fromValue: '19',
            toValue: '23',
            commentValue: 'Test comments.'
          }
        },
        {
          type: 'cleaning',
          data: {
            leftValue: 'Test cleaning value.',
            rightValue: 'Test comments.'
          }
        }
      ]
    };
    const nodeId = 4;
    const url = `${Config.magasin.urls.storagefacility.baseUrl(new MuseumId(99))}/${nodeId}/observations`;
    nock('http://localhost')
      .post(url, observationAddData)
      .reply(201, {
        id: 10,
        doneBy: 1,
        doneDate: '2016-10-18T00:00:00+00:00',
        affectedThing: 4,
        registeredBy: 'Darth Vader',
        registeredDate: '2016-10-18T13:42:10+00:00',
        eventType: 'Observation',
        gas: {
          note: 'Gas comments',
          gas: 'test Gas'
        }
      });

    const observationStore = mockStore();

    return observationStore.dispatch(actions.addObservation(4, new MuseumId(99), observationAddData))
      .then(() => {
        expect(observationStore.getActions()).toMatchSnapshot();
      });
  });

  it('Add observation no action', () => {
    expect(
      reducer(undefined, {})
    ).toMatchSnapshot();
  });

  it('Add observation initial action', () => {
    expect(
      reducer(undefined, {
        type: actions.ADD
      })
    ).toMatchSnapshot();
  });

  it('Add observation success action', () => {
    expect(
      reducer(undefined, {
        type: actions.ADD_SUCCESS,
        result: {
          doneBy: '062f6a86-7f54-4d0b-9cbe-2b83b6af9b83'
        }
      })
    ).toMatchSnapshot();
  });

  it('Add observation fail action', () => {
    expect(
      reducer(undefined, {
        type: actions.ADD_FAIL,
        error: Error('Some error occurred in the add observation data method.')
      })
    ).toMatchSnapshot();
  });
});
