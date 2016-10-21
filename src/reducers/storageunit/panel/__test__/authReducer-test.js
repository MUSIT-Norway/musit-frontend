/**
 * Created by rituvesh on 20.10.16.
 */
import configureMockStore from 'redux-mock-store'
import createMiddleware from '../../../middleware/clientMiddleware'
import ApiClient from '../../../middleware/ApiClient'
import Config from '../../../config'
import request from 'superagent';
import nocker from 'superagent-nock';

import * as actions from '../../../reducers/auth'
import reducer from '../../../reducers/auth'

const nock = nocker(request);
const middlewares = [ createMiddleware(new ApiClient()) ]
const mockStore = configureMockStore(middlewares)

describe('Auth', () => {
    it('creates LOAD_ACTOR_SUCCESS when fetching data has been done', () => {
        const url = `${Config.magasin.urls.storagefacility.baseUrl(1)}/report`
        nock('http://localhost')
            .get(url)
            .reply(200, {
                id: 1,
                fn: 'Jarle Stabell',
                dataportenId: 'jarle'
            })
        const store = mockStore()

        return store.dispatch(actions.loadActor())
            .then(() => {
                expect(store.getActions()).toMatchSnapshot()
            })
    })

    it('no action', () => {
        expect(
            reducer(undefined, {})
        ).toMatchSnapshot()
    })

    it('initial action', () => {
        expect(
            reducer(undefined, {
                type: actions.LOAD_ACTOR
            })
        ).toMatchSnapshot()
    })

    it('success action', () => {
        expect(
            reducer(undefined, {
                type: actions.LOAD_ACTOR_SUCCESS,
                result: {
                    someField: 1
                }
            })
        ).toMatchSnapshot()
    })

    it('fail action', () => {
        expect(
            reducer(undefined, {
                type: actions.LOAD_ACTOR_FAILURE,
                error: Error('Some error here.')
            })
        ).toMatchSnapshot()
    })
})