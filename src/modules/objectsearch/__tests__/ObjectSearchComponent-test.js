import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import { ObjectSearchComponent } from '../ObjectSearchComponent';
import { getPath } from '../../../shared/util';
import sinon from 'sinon';

describe('ObjectSearchComponent', () => {
  const path = ',1,2,3,';
  const pathNames = [
    {
      nodeId: 1,
      nodeUuid: '0615c304-e7ec-46ad-aebc-399884181eaf',
      name: 'Root',
      type: 'Organization'
    },
    {
      nodeId: 2,
      nodeUuid: 'ae3a3752-f8f7-4ab1-84b2-f088324f1a6f',
      name: 'Musit',
      type: 'Building'
    },
    {
      nodeId: 3,
      nodeUuid: '403cebde-082c-4002-8f78-16ad178a054a',
      name: 'Kontoret',
      type: 'Room'
    }
  ];
  const testData = {
    totalMatches: 20,
    matches: new Array(20).fill({
      museumNo: '12345',
      subNo: '45',
      term: 'Fuglekasse',
      id: 1,
      breadcrumb: getPath({ path, pathNames }),
      path: path,
      pathNames: pathNames
    })
  };

  it('should display object 1', () => {
    const clear = sinon.spy();
    const searchForObjects = sinon.spy();
    const onChangeField = sinon.spy();
    const wrapper = shallow(
      <ObjectSearchComponent
        getMuseumNo={() => 'kaka'}
        getSubNo={() => '12'}
        getTerm={() => 'a special kake'}
        clearSearch={clear}
        searchForObjects={searchForObjects}
        onChangeField={onChangeField}
        appSession={{
          accessToken: 'wakka',
          museumId: 99,
          collectionId: 'ddd'
        }}
        objectSearchStore={{
          loaded: true,
          data: testData,
          params: {
            currentPage: 1,
            perPage: 5
          }
        }}
        pickList={{
          objects: []
        }}
        isItemAdded={() => 'hi'}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
    expect(clear.calledOnce).toBe(false);
    expect(searchForObjects.calledOnce).toBe(false);
    expect(onChangeField.calledOnce).toBe(false);
    wrapper.find('.btn-default').simulate('click', { preventDefault: () => true });
    expect(searchForObjects.getCall(0).args[0].token).toBe('wakka');
    expect(searchForObjects.getCall(0).args[0].collectionId).toBe('ddd');
    expect(searchForObjects.getCall(0).args[0].museumId).toBe(99);
    expect(searchForObjects.getCall(0).args[0].page).toBe(1);
    expect(searchForObjects.getCall(0).args[0].museumNo).toBe('kaka');
    expect(searchForObjects.getCall(0).args[0].subNo).toBe('12');
    expect(searchForObjects.getCall(0).args[0].term).toBe('a special kake');
    expect(searchForObjects.getCall(0).args[0].perPage).toBe(50);
  });
});
