import assert from 'assert';
import observationControlGridReducer from '../index';

import * as actions from '../../observationcontrol/index';
import reducer from '../../observationcontrol/index';
import Config from '../../../../config';
import request from 'superagent';
import nocker from 'superagent-nock';
const nock = nocker(request);

const initialState = {
  data: [
    { eventType: 'Observation',
    doneDate: '1990-11-11',
    doneBy: '2',
    'subEvents-parts': [
      { eventType: 'ObservationLightingCondition',
      lightingCondition: 'Veldig lyst idag',
      note: 'Skru ned lyset' },
      { eventType: 'ObservationAlcohol',
      condition: 'Mye alkohol',
      note: 'Tynn ut',
      volume: '93.5' },
      { eventType: 'ObservationPest',
      identification: 'Banafluer i fruktkurven',
      note: 'Eplecidereddik og Zalo',
      lifeCycles: [{ stage: 'Puppeskinn', number: '3' }, { stage: 'Larva', number: '3' }] }
    ] },
    { eventType: 'Control',
    doneDate: '1981-12-01',
    doneBy: '1',
    'subEvents-parts': [
      { eventType: 'ControlRelativeHumidity',
       OK: true },
      { eventType: 'ControlLightingCondition',
       OK: true },
      { eventType: 'ControlTemperature',
       OK: false },
      { eventType: 'ControlHypoxicAir',
       OK: false },
      { eventType: 'ControlAlcohol',
       OK: true }
    ]
   },
    { eventType: 'Observation',
    doneDate: '1994-02-21',
    doneBy: '2',
    'subEvents-parts': [
      { eventType: 'ObservationMold',
      mold: 'Muggent',
      note: 'Eddik' },
      { eventType: 'ObservationCleaning',
      cleaning: 'Urent',
      note: 'Her må der vaskes bedre' },
      { eventType: 'ObservationPest',
      identification: 'Sommerfugler i under takbjelken',
      note: 'Gasses',
      lifeCycles: [{ stage: 'Puppe', number: '1' }, { stage: 'Larva', number: '3' }] }
    ] },
    { eventType: 'Control',
    doneDate: '1891-12-01',
    doneBy: '2',
    'subEvents-parts': [
      { eventType: 'ControlCleaning',
       OK: true },
      { eventType: 'ControlHypoxicAir',
       OK: true },
      { eventType: 'ControlGass',
       OK: false },
      { eventType: 'ControlHypoxicAir',
       OK: false },
      { eventType: 'ControlPest',
       OK: true }
    ] }
  ]
};

describe('ObservationControlGridReducer', () => {

  it('Initial state is set', () => {
    const state = observationControlGridReducer(initialState, {});
    assert(state === initialState);
  });

  it('creates LOAD_ACTOR_SUCCESS when fetching data has been done', () => {
    const actorPostData = [1,2];
    const url = '/api/actor/v1/person/details';
    nock('http://localhost')
            .post(url, actorPostData)
            .reply(201, [
              {
                id: 1,
                fn: 'Jarle Stabell',
                dataportenId: 'jarle'
              },
              {
                id: 2,
                fn: 'Stein A. Olsen',
                dataportenId: 'stein'
              }
            ]);
    const store = mockStore();

    return store.dispatch(actions.loadActor([1, 2]))
            .then(() => {
              expect(store.getActions()).toMatchSnapshot();
            });
  });

  it('actor: no action', () => {
    expect(
            reducer(undefined, {})
        ).toMatchSnapshot();
  });

  it('actor: initial action', () => {
    expect(
            reducer(undefined, {
              type: actions.LOAD_ACTOR
            })
        ).toMatchSnapshot();
  });

  it('actor: success action', () => {
    expect(
            reducer(undefined, {
              type: actions.LOAD_ACTOR_SUCCESS,
              result: {
                someField: 1
              }
            })
        ).toMatchSnapshot();
  });

  it('actor: fail action', () => {
    expect(
            reducer(undefined, {
              type: actions.LOAD_ACTOR_FAILURE,
              error: Error('Some error in loadActor.')
            })
        ).toMatchSnapshot();
  });


  it('creates LOAD_SUCCESS when fetching data has been done', () => {
    const OutputSuccess = {
      data: [
                { eventType: 'Observation',
                    doneDate: '1990-11-11',
                    doneBy: '2',
                    'subEvents-parts': [
                        { eventType: 'ObservationLightingCondition',
                            lightingCondition: 'Veldig lyst idag',
                            note: 'Skru ned lyset' },
                        { eventType: 'ObservationAlcohol',
                            condition: 'Mye alkohol',
                            note: 'Tynn ut',
                            volume: '93.5' },
                        { eventType: 'ObservationPest',
                            identification: 'Banafluer i fruktkurven',
                            note: 'Eplecidereddik og Zalo',
                            lifeCycles: [{ stage: 'Puppeskinn', number: '3' }, { stage: 'Larva', number: '3' }] }
                    ] },
                { eventType: 'Control',
                    doneDate: '1981-12-01',
                    doneBy: '1',
                    'subEvents-parts': [
                        { eventType: 'ControlRelativeHumidity',
                            OK: true },
                        { eventType: 'ControlLightingCondition',
                            OK: true },
                        { eventType: 'ControlTemperature',
                            OK: false },
                        { eventType: 'ControlHypoxicAir',
                            OK: false },
                        { eventType: 'ControlAlcohol',
                            OK: true }
                    ]
                },
                { eventType: 'Observation',
                    doneDate: '1994-02-21',
                    doneBy: '2',
                    'subEvents-parts': [
                        { eventType: 'ObservationMold',
                            mold: 'Muggent',
                            note: 'Eddik' },
                        { eventType: 'ObservationCleaning',
                            cleaning: 'Urent',
                            note: 'Her må der vaskes bedre' },
                        { eventType: 'ObservationPest',
                            identification: 'Sommerfugler i under takbjelken',
                            note: 'Gasses',
                            lifeCycles: [{ stage: 'Puppe', number: '1' }, { stage: 'Larva', number: '3' }] }
                    ] },
                { eventType: 'Control',
                    doneDate: '1891-12-01',
                    doneBy: '2',
                    'subEvents-parts': [
                        { eventType: 'ControlCleaning',
                            OK: true },
                        { eventType: 'ControlHypoxicAir',
                            OK: true },
                        { eventType: 'ControlGass',
                            OK: false },
                        { eventType: 'ControlHypoxicAir',
                            OK: false },
                        { eventType: 'ControlPest',
                            OK: true }
                    ] }
      ]
    };
    const id = 1;
    const url = `${Config.magasin.urls.storagefacility.baseUrl(99)}/${id}/events`;
    nock('http://localhost')
            .get(url)
            .reply(200, OutputSuccess);
    const store = mockStore();

    return store.dispatch(actions.loadControlsAndObservationsForNode(1))
            .then(() => {
              expect(store.getActions()).toMatchSnapshot();
            });
  });

  it('observation control: no action', () => {
    expect(
            reducer(undefined, {})
        ).toMatchSnapshot();
  });

  it('observation control: initial action', () => {
    expect(
            reducer(undefined, {
              type: actions.LOAD
            })
        ).toMatchSnapshot();
  });

  it('observation control: success action', () => {
    expect(
            reducer(undefined, {
              type: actions.LOAD_SUCCESS,
              result: {
                someField: 1
              }
            })
        ).toMatchSnapshot();
  });

  it('observation control: fail action', () => {
    expect(
            reducer(undefined, {
              type: actions.LOAD_FAIL,
              error: Error('Some error to load observation control data.')
            })
        ).toMatchSnapshot();
  });
});
