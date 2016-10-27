import * as actions from '../actions'
import * as constants from '../constants'
import reducer from '../reducer'
import Config from '../../../config'
import request from 'superagent';
import nocker from 'superagent-nock';
const nock = nocker(request);

describe('Object search reducer', () => {
    it('creates SEARCH_OBJECTS_SUCCESS when fetching data has been done', () => {
        const params = {
            museumNo:'',
            subNo: '',
            term: ''
        }
        const page = {
            page: 1,
            perPage: 50
        }
        const baseUrl = Config.magasin.urls.objectsearch.baseUrl(1);
        const museumNoQuery = `museumNo=${params.museumNo || ''}`
        const subNoQuery = `subNo=${params.subNo || ''}`
        const termQuery = `term=${params.term || ''}`
        const pageQuery = `page=${page}`
        const limitQuery = `limit=${params.perPage}`
        const url = `${baseUrl}?${museumNoQuery}&${subNoQuery}&${termQuery}&${pageQuery}&${limitQuery}`
        nock('http://localhost')
            .get(url)
            .reply(200, {
                totalMatches: 1,
                matches:
                    [
                        {
                            id: 51,
                            museumNo: 'MusN11',
                            term: 'Solsikke'
                        }
                        ]
            })
        const store = mockStore()

        return store.dispatch(actions.searchForObjects(params, page))
            .then(() => {
                expect(store.getActions()).toMatchSnapshot()
            })
    })

    it('search objects: no action', () => {
        expect(
            reducer(undefined, {})
        ).toMatchSnapshot()
    })

    it('search objects: initial action', () => {
        expect(
            reducer(undefined, {
                type: constants.SEARCH_OBJECTS
            })
        ).toMatchSnapshot()
    })

    it('search objects: success action', () => {
        expect(
            reducer(undefined, {
                type: constants.SEARCH_OBJECTS_SUCCESS,
                result: {
                    someField: 1
                }
            })
        ).toMatchSnapshot()
    })

    it('search objects: fail action', () => {
        expect(
            reducer(undefined, {
                type: constants.SEARCH_OBJECTS_FAIL,
                error: Error('search objects has some error.')
            })
        ).toMatchSnapshot()
    })
})
  