
import configureMockStore from 'redux-mock-store'
import createMiddleware from '../../../../middleware/clientMiddleware'
import ApiClient from '../../../../middleware/ApiClient'
import Config from '../../../../config'
import request from 'superagent';
import nocker from 'superagent-nock';

import * as actions from '../../../../reducers/grid/move/index'
import reducer from '../../../../reducers/grid/move/index'

const nock = nocker(request);
const middlewares = [ createMiddleware(new ApiClient()) ]
const mockStore = configureMockStore(middlewares)

describe('Auth', () => {
    it('creates LOAD_ACTOR_SUCCESS when fetching data has been done', () => {
        const actorPostData = [1,2]
        const url = '/api/actor/v1/person/details'
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
            ])
        const store = mockStore()

        return store.dispatch(actions.loadActor([1, 2]))
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
            reducer({ data:
                [
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
            }, {
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
                type: actions.LOAD_ACTOR_FAIL,
                error: Error('Some error here.')
            })
        ).toMatchSnapshot()
    })
})