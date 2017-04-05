import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import { PickListComponent } from '../PickListComponent';
import { AppSession } from '../../app/appSession';
import { expect as e } from 'chai';
import sinon from 'sinon';

describe('PickListComponent for nodes', () => {
  const pickList = {
    nodes: [
      {
        marked: true,
        value: { id: 1, name: 'Hei' },
        path: [1]
      },
      {
        marked: true,
        value: { id: 2, name: 'Hei' },
        path: [1, 2]
      },
      {
        marked: true,
        value: { id: 3, name: 'Hei' },
        path: [1, 3]
      },
      {
        marked: true,
        value: { id: 4, name: 'Hei' },
        path: [1, 3]
      }
    ],
    objects: [
      {
        marked: true,
        value: {
          id: 1,
          name: 'Test21',
          mainObjectId: 1,
          isMainObject: () => true
        },
        path: [1]
      },
      {
        marked: true,
        value: {
          id: 2,
          name: 'Test2',
          mainObjectId: 1,
          isMainObject: () => false
        },
        path: [1, 2]
      },
      {
        marked: false,
        value: {
          id: 3,
          name: 'Test23',
          isMainObject: () => true
        },
        path: [1, 3]
      }
    ]
  };

  it('should display component (nodes) correctly', () => {
    const wrapper = shallow(
      <PickListComponent
        route={{ type: 'nodes' }}
        pickList={pickList}
        markNode={x => x}
        markObject={x => x}
        markMainObject={x => x}
        removeNode={x => x}
        removeObject={x => x}
        appSession={new AppSession()}
        refreshNode={x => x}
        refreshObjects={x => x}
        emitError={x => x}
        emitSuccess={x => x}
        classExistsOnDom={x => x}
        moveItems={x => x}
        isTypeNode={() => true}
        toggleScanner={() => true}
        scannerEnabled={true}
      />
    );

    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('Testing functions nodes', () => {
    const onToggleNode = sinon.spy();
    const onToggleObject = sinon.spy();
    const onRemoveObject = sinon.spy();
    const onRemoveNode = sinon.spy();
    const onShowModal = sinon.spy();
    const onToggleScanner = sinon.spy();

    const wrapper = mount(
      <PickListComponent
        route={{ type: 'nodes' }}
        pickList={pickList}
        markNode={onToggleNode}
        markObject={onToggleObject}
        markMainObject={x => x}
        removeNode={onRemoveNode}
        removeObject={onRemoveObject}
        appSession={new AppSession()}
        refreshNode={x => x}
        refreshObjects={x => x}
        emitError={x => x}
        emitSuccess={x => x}
        iconRendrer={x => x}
        classExistsOnDom={x => x}
        moveItems={x => x}
        isTypeNode={() => true}
        toggleScanner={onToggleScanner}
        scannerEnabled={true}
        showModal={onShowModal}
      />
    );

    const scanButton = wrapper
      .find('Grid')
      .childAt(0)
      .childAt(0)
      .childAt(0)
      .childAt(1)
      .childAt(0);
    scanButton.simulate('click');
    e(onToggleScanner.calledOnce).to.equal(true);

    const checkBox = wrapper
      .find('Grid')
      .children()
      .find('Table')
      .children()
      .find('thead')
      .children()
      .find('tr')
      .childAt(0)
      .childAt(0);
    checkBox.simulate('change');
    e(onToggleNode.calledOnce).to.equal(true);

    const modalButton = wrapper
      .find('Grid')
      .children()
      .find('Table')
      .children()
      .find('thead')
      .children()
      .find('tr')
      .childAt(1)
      .childAt(2);
    modalButton.simulate('click');
    e(onShowModal.calledOnce).to.equal(true);

    const removeButton = wrapper
      .find('Grid')
      .children()
      .find('Table')
      .children()
      .find('thead')
      .children()
      .find('tr')
      .childAt(1)
      .childAt(4);
    removeButton.simulate('click');
    e(onRemoveNode.calledOnce).to.equal(true);
  });
});
