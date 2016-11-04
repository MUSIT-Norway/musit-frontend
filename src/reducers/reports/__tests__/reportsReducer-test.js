import configureMockStore from 'redux-mock-store';
import createMiddleware from '../../../middleware/clientMiddleware';
import ApiClient from '../../../middleware/ApiClient';
import * as actions from '../index';
import reducer from '../index';
import Config from '../../../config';
import request from 'superagent';
import nocker from 'superagent-nock';
const nock = nocker(request);

const middlewares = [ createMiddleware(new ApiClient()) ];
const mockStore = configureMockStore(middlewares);

describe('KD Report', () => {
  it('creates LOAD_KD_REPORT_SUCESS when fetching reports has been done', () => {
    const url = `${Config.magasin.urls.storagefacility.baseUrl(1)}/report`;
    nock('http://localhost')
            .get(url)
            .reply(200, {
              totalArea: 1,
              perimeterSecurity: 3,
              theftProtection: 123,
              fireProtection: 13,
              waterDamageAssessment: 55,
              routinesAndContingencyPlan: 12
            });

    const store = mockStore();

    return store.dispatch(actions.loadKDReport())
            .then(() => {
              expect(store.getActions()).toMatchSnapshot();
            });
  });

  it('no action', () => {
    expect(
            reducer(undefined, {})
        ).toMatchSnapshot();
  });

  it('initial action', () => {
    expect(
            reducer(undefined, {
              type: actions.LOAD_KD_REPORT
            })
        ).toMatchSnapshot();
  });

  it('success action', () => {
    expect(
            reducer(undefined, {
              type: actions.LOAD_KD_REPORT_SUCESS,
              result: {
                someField: 1
              }
            })
        ).toMatchSnapshot();
  });

  it('fail action', () => {
    expect(
            reducer(undefined, {
              type: actions.LOAD_KD_REPORT_FAIL,
              error: Error('Some error here')
            })
        ).toMatchSnapshot();
  });
});