import deepFreeze from 'deep-freeze';
import MuseumId from '../../../shared/models/museumId';
import * as actions from '../index';
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

deepFreeze(sendToBackend);

describe('MoveReducer', () => {
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
});
