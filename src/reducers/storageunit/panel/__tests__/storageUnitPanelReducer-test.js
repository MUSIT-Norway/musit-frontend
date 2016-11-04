
import * as actions from '../index';
import reducer from '../index';
import Config from '../../../../config';
import request from 'superagent';
import nocker from 'superagent-nock';
const nock = nocker(request);


describe('ReducerStoragUnitPanel', () => {
  const loadState = {
    id: 3,
    name: 'Forskningens hus',
    isPartOf: 2,
    groupRead: 'foo',
    path: ',1,2,3,',
    pathNames: [
      {
        nodeId: 1,
        name: 'root-node'
      },
      {
        nodeId: 2,
        name: 'Utviklingsmuseet'
      },
      {
        nodeId: 3,
        name: 'Forskningens hus'
      }],
    environmentRequirement: {
      comment: "fdsfd"
    },
    updatedBy:666,
    updatedDate: '2016-10-24T15:41:35+00:00',
    type: 'Building'
  };
  it('creates LOAD_SUCCESS when fetching data has been done', () => {
    const id = 3;
    const url = `${Config.magasin.urls.storagefacility.baseUrl(1)}/${id}`;
    nock('http://localhost')
            .get(url)
            .reply(200, loadState);
    const store = mockStore();

    return store.dispatch(actions.load(3))
            .then(() => {
              expect(store.getActions()).toMatchSnapshot();
            });
  });

  it('LOAD: no action', () => {
    expect(
            reducer(undefined, {})
        ).toMatchSnapshot();
  });

  it('LOAD: initial action', () => {
    expect(
            reducer(undefined, {
              type: actions.LOAD
            })
        ).toMatchSnapshot();
  });

  it('LOAD: success action', () => {
    expect(
            reducer(undefined, {
              type: actions.LOAD_SUCCESS,
              result: {
                someField: 1
              }
            })
        ).toMatchSnapshot();
  });

  it('LOAD: fail action', () => {
    expect(
            reducer(undefined, {
              type: actions.LOAD_FAIL,
              error: Error('LOAD has some error.')
            })
        ).toMatchSnapshot();
  });
  const putData = {
    id: 2,
    name: "p5",
    isPartOf:1,
    groupRead: 'foo',
    path: ',1,2,',
    pathNames:[
      {
        nodeId: 1,
        name: 'root-node'
      },
      {
        nodeId: 2,
        name: 'Utviklingsmuseet'
      }
    ],
    environmentRequirement: {},
    securityAssessment: {},
    environmentAssessment: {},
    updatedBy: 123,
    updatedDate: '2016-10-24T16:13:24+00:00',
    type: 'Room'
  };
  it('update INSERT_SUCCESS when fetching data has been done', () => {
    const id = 2;
    const url = `${Config.magasin.urls.storagefacility.baseUrl(1)}/${id}`;
    nock('http://localhost')
            .put(url, putData)
            .reply(201, putData);
    const store = mockStore();

    return store.dispatch(actions.update(putData))
            .then(() => {
              expect(store.getActions()).toMatchSnapshot();
            });
  });


  it('update: no action', () => {
    expect(
            reducer(undefined, {})
        ).toMatchSnapshot();
  });

  it('update: initial action', () => {
    expect(
            reducer(undefined, {
              type: actions.INSERT
            })
        ).toMatchSnapshot();
  });

  it('update: success action', () => {
    expect(
            reducer(undefined, {
              type: actions.INSERT_SUCCESS,
              result: {
                someField: 1
              }
            })
        ).toMatchSnapshot();
  });

  it('update: fail action', () => {
    expect(
            reducer(undefined, {
              type: actions.INSERT_FAIL,
              error: Error('Some error in update.')
            })
        ).toMatchSnapshot();
  });

  it('insert INSERT_SUCCESS when fetching data has been done', () => {
    const postData = {
      name: "p5",
      isPartOf:1,
      groupRead: 'foo',
      environmentRequirement: {},
      securityAssessment: {},
      environmentAssessment: {},
      type: 'Room',
      area: 1
    };
    const parentId = 1;
    const url = `${Config.magasin.urls.storagefacility.baseUrl(1)}${!parentId ? '/root' : ''}`;
    nock('http://localhost')
            .post(url, postData)
            .reply(201, putData);
    const store = mockStore();

    return store.dispatch(actions.insert(1, postData))
            .then(() => {
              expect(store.getActions()).toMatchSnapshot();
            });
  });


  it('insert: no action', () => {
    expect(
            reducer(undefined, {})
        ).toMatchSnapshot();
  });

  it('insert: initial action', () => {
    expect(
            reducer(undefined, {
              type: actions.INSERT
            })
        ).toMatchSnapshot();
  });

  it('insert: success action', () => {
    expect(
            reducer(undefined, {
              type: actions.INSERT_SUCCESS,
              result: {
                someField: 1
              }
            })
        ).toMatchSnapshot();
  });

  it('insert: fail action', () => {
    expect(
            reducer(undefined, {
              type: actions.INSERT_FAIL,
              error: Error('Some error in insert.')
            })
        ).toMatchSnapshot();
  });
});
