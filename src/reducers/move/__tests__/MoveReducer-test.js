import assert from 'assert';
import deepFreeze from 'deep-freeze';
import suReducer, {moveObject} from '../index';
import MuseumId from '../../../models/museumId';
import * as actions from '../index';
import reducer from '../index';
import Config from '../../../config';
import request from 'superagent';
import nocker from 'superagent-nock';
const nock = nocker(request);

const sendToBackend = [
  {
    doneBy: 3,
    items: [1],
    destination: 1
  }
];
const loadingState = {
  loading: true,
  loaded: false
};
const successState = {
  loading: false,
  loaded: true
};
const failureState = {
  loading: false,
  loaded: false
};

deepFreeze(sendToBackend);

describe('MoveReducer', () => {
  it('Call move object', () => {
    assert(sendToBackend !== moveObject(1, [1], 1));
  });

  it('Move object.', () => {
    const newstate = suReducer(loadingState, {type: 'musit/move/object/start'});
    assert(JSON.stringify(newstate) === JSON.stringify(loadingState));
  });

  it('Move object success', () => {
    const newstate = suReducer(successState, {type: 'musit/move/object/success'});
    assert.deepStrictEqual(newstate, successState);
  });

  it('Move object failure', () => {
    const newstate = suReducer(failureState, {type: 'musit/move/object/failure'});
    assert(JSON.stringify(newstate) === JSON.stringify(failureState));
  });

  it('Move node.', () => {
    const newstate = suReducer(loadingState, {type: 'musit/move/node/start'});
    assert(JSON.stringify(newstate) === JSON.stringify(loadingState));
  });

  it('Move node success', () => {
    const newstate = suReducer(successState, {type: 'musit/move/node/success'});
    assert(JSON.stringify(newstate) === JSON.stringify(successState));
  });

  it('Move node failure', () => {
    const newstate = suReducer(failureState, {type: 'musit/move/node/failure'});
    assert(JSON.stringify(newstate) === JSON.stringify(failureState));
  });


  it('creates MOVE_OBJECT_SUCCESS when fetching data has been done', () => {
    const putData = {
      doneBy: 'f4e1eba9-8add-4675-9836-db59f7115d7c',
      destination: 4,
      items: [2, 3]
    };
    const url = `${Config.magasin.urls.storagefacility.baseUrl(new MuseumId(99))}/moveObject`;
    nock('http://localhost')
      .put(url, putData)
      .reply(201, {
        moved: [2, 3],
        failed: []
      });
    const store = mockStore();

    return store.dispatch(actions.moveObject([2, 3], 4, 'f4e1eba9-8add-4675-9836-db59f7115d7c', new MuseumId(99)))
      .then(() => {
        expect(store.getActions()).toMatchSnapshot();
      });
  });

  it('object: no action', () => {
    expect(
      reducer(undefined, {})
    ).toMatchSnapshot();
  });

  it('object: initial action', () => {
    expect(
      reducer(undefined, {
        type: actions.MOVE_OBJECT
      })
    ).toMatchSnapshot();
  });

  it('object: success action', () => {
    expect(
      reducer(undefined, {
        type: actions.MOVE_OBJECT_SUCCESS,
        result: {
          someField: 1
        }
      })
    ).toMatchSnapshot();
  });

  it('object: fail action', () => {
    expect(
      reducer(undefined, {
        type: actions.MOVE_OBJECT_FAILURE,
        error: Error('Some error in moveObject.')
      })
    ).toMatchSnapshot();
  });

  it('creates MOVE_NODE_SUCCESS when fetching data has been done', () => {
    const putData = {
      doneBy: 1,
      destination: 4,
      items: [2, 3]
    };
    const url = `${Config.magasin.urls.storagefacility.baseUrl(new MuseumId(99))}/moveNode`;
    nock('http://localhost')
      .put(url, putData)
      .reply(201, {
        moved: [2, 3],
        failed: []
      });
    const store = mockStore();

    return store.dispatch(actions.moveNode([2, 3], 4, 1, new MuseumId(99)))
      .then(() => {
        expect(store.getActions()).toMatchSnapshot();
      });
  });

  it('node: no action', () => {
    expect(
      reducer(undefined, {})
    ).toMatchSnapshot();
  });

  it('node: initial action', () => {
    expect(
      reducer(undefined, {
        type: actions.MOVE_NODE
      })
    ).toMatchSnapshot();
  });

  it('node: success action', () => {
    expect(
      reducer(undefined, {
        type: actions.MOVE_NODE_SUCCESS,
        result: {
          someField: 1
        }
      })
    ).toMatchSnapshot();
  });

  it('node: fail action', () => {
    expect(
      reducer(undefined, {
        type: actions.MOVE_NODE_FAILURE,
        error: Error('Some error in moveNode.')
      })
    ).toMatchSnapshot();
  });
});
