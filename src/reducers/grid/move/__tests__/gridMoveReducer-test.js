
import * as actions from '../../../../reducers/grid/move/index'
import reducer from '../../../../reducers/grid/move/index'
import Config from '../../../../config'
import request from 'superagent';
import nocker from 'superagent-nock';
const nock = nocker(request);

describe('GridMoveHistory', () => {
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
                type: actions.LOAD_ACTOR_FAIL,
                error: Error('Some error here.')
            })
        ).toMatchSnapshot()
    })


    it('creates LOAD_SUCCESS when fetching data has been done', () => {
        const OutputSuccess = { data:
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
        }
        const id = 1
        const url = `${Config.magasin.urls.storagefacility.baseUrl(1)}/objects/${id}/locations`
        nock('http://localhost')
            .get(url)
            .reply(200, OutputSuccess)
        const store = mockStore()

        return store.dispatch(actions.loadMoveHistoryForObject(1))
            .then(() => {
                expect(store.getActions()).toMatchSnapshot()
            })
    })

    it('Move history: no action', () => {
        expect(
            reducer(undefined, {})
        ).toMatchSnapshot()
    })

    it('Move history: initial action', () => {
        expect(
            reducer(undefined, {
                type: actions.LOAD
            })
        ).toMatchSnapshot()
    })

    it('Move history: success action', () => {
        expect(
            reducer(undefined, {
                type: actions.LOAD_SUCCESS,
                result: {
                    someField: 1
                }
            })
        ).toMatchSnapshot()
    })

    it('Move history: fail action', () => {
        expect(
            reducer(undefined, {
                type: actions.LOAD_FAIL,
                error: Error('Some error to load history data.')
            })
        ).toMatchSnapshot()
    })
})