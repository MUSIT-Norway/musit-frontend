import { shallow, mount } from 'enzyme';
import { shallowToJson, mountToJson } from 'enzyme-to-json';
import React from 'react';
import { PickListComponent } from '../PickListComponent';
import { expect as e } from 'chai';
import sinon from 'sinon';

describe('PickListComponent for objects', () => {
  const history = {
    push: () => {}
  };

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
          term: 'Test21',
          mainObjectId: 1
        },
        path: [1]
      },
      {
        marked: true,
        value: {
          id: 2,
          term: 'Test2',
          mainObjectId: 1
        },
        path: [1, 2]
      },
      {
        marked: false,
        value: {
          id: 3,
          term: 'Test23'
        },
        path: [1, 3]
      }
    ]
  };

  it('Should not fail horribly', () => {
    const onToggleNode = sinon.spy();
    const onToggleObject = sinon.spy();
    const onRemoveObject = sinon.spy();
    const onRemoveNode = sinon.spy();

    const wrapper = mount(
      <PickListComponent
        createConservation={() => {}}
        createAnalysis={() => {}}
        createSample={() => {}}
        type="objects"
        pickList={pickList}
        markNode={onToggleNode}
        markObject={onToggleObject}
        markMainObject={x => x}
        removeNode={onRemoveNode}
        removeObject={onRemoveObject}
        appSession={{}}
        refreshNode={x => x}
        refreshObjects={x => x}
        emitError={x => x}
        emitSuccess={x => x}
        iconRendrer={x => x}
        classExistsOnDom={x => x}
        moveItems={x => x}
        isTypeNode={false}
        toggleScanner={() => true}
        scannerEnabled={true}
        history={history}
      />
    );

    expect(mountToJson(wrapper)).toMatchSnapshot();
  });

  it('should display component (objects) correctly', () => {
    const wrapper = shallow(
      <PickListComponent
        createConservation={() => {}}
        createAnalysis={() => {}}
        createSample={() => {}}
        type="objects"
        pickList={pickList}
        markNode={x => x}
        markObject={x => x}
        markMainObject={x => x}
        removeNode={x => x}
        removeObject={x => x}
        appSession={{}}
        refreshNode={x => x}
        refreshObjects={x => x}
        emitError={x => x}
        emitSuccess={x => x}
        classExistsOnDom={x => x}
        moveItems={x => x}
        isTypeNode={false}
        toggleScanner={() => true}
        scannerEnabled={true}
        history={history}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should call removeObject when user clicks remove button', () => {
    const onToggleNode = sinon.spy();
    const onToggleObject = sinon.spy();
    const onRemoveObject = sinon.spy();
    const onRemoveNode = sinon.spy();
    const onToggleMainObject = sinon.spy();

    const wrapper = mount(
      <PickListComponent
        createConservation={() => {}}
        createAnalysis={() => {}}
        createSample={() => {}}
        type="objects"
        pickList={pickList}
        markNode={onToggleNode}
        markObject={onToggleObject}
        markMainObject={onToggleMainObject}
        removeNode={onRemoveNode}
        removeObject={onRemoveObject}
        appSession={{}}
        refreshNode={x => x}
        refreshObjects={x => x}
        emitError={x => x}
        emitSuccess={x => x}
        iconRendrer={x => x}
        classExistsOnDom={x => x}
        moveItems={x => x}
        isTypeNode={false}
        toggleScanner={() => true}
        scannerEnabled={true}
        history={history}
      />
    );

    const removeButton = wrapper
      .find('Grid')
      .children()
      .find('Table')
      .children()
      .find('thead')
      .children()
      .find('tr')
      .childAt(1)
      .childAt(7);
    removeButton.simulate('click');
    e(onRemoveObject.calledOnce).to.equal(true);
  });

  it('should call toggleMainObject when user clicks toggle on main object', () => {
    const onToggleNode = sinon.spy();
    const onToggleObject = sinon.spy();
    const onRemoveObject = sinon.spy();
    const onRemoveNode = sinon.spy();
    const onToggleMainObject = sinon.spy();

    const wrapper = mount(
      <PickListComponent
        createConservation={() => {}}
        createAnalysis={() => {}}
        createSample={() => {}}
        type="objects"
        pickList={pickList}
        markNode={onToggleNode}
        markObject={onToggleObject}
        markMainObject={onToggleMainObject}
        removeNode={onRemoveNode}
        removeObject={onRemoveObject}
        appSession={{}}
        refreshNode={x => x}
        refreshObjects={x => x}
        emitError={x => x}
        emitSuccess={x => x}
        iconRendrer={x => x}
        classExistsOnDom={x => x}
        moveItems={x => x}
        isTypeNode={false}
        toggleScanner={() => true}
        scannerEnabled={true}
        history={history}
      />
    );

    const toggleMainObj = wrapper
      .find('Grid')
      .children()
      .find('Table')
      .children()
      .find('tbody')
      .childAt(0)
      .childAt(0)
      .childAt(0)
      .childAt(0);
    toggleMainObj.simulate('change');
    e(onToggleMainObject.calledOnce).to.equal(true);
  });

  it('should call toggleObject when user clicks toggle button', () => {
    const onToggleNode = sinon.spy();
    const onToggleObject = sinon.spy();
    const onRemoveObject = sinon.spy();
    const onRemoveNode = sinon.spy();
    const onToggleMainObject = sinon.spy();

    const wrapper = mount(
      <PickListComponent
        createConservation={() => {}}
        createAnalysis={() => {}}
        createSample={() => {}}
        type="objects"
        pickList={pickList}
        markNode={onToggleNode}
        markObject={onToggleObject}
        markMainObject={onToggleMainObject}
        removeNode={onRemoveNode}
        removeObject={onRemoveObject}
        appSession={{}}
        refreshNode={x => x}
        refreshObjects={x => x}
        emitError={x => x}
        emitSuccess={x => x}
        iconRendrer={x => x}
        classExistsOnDom={x => x}
        moveItems={x => x}
        isTypeNode={false}
        toggleScanner={() => true}
        scannerEnabled={true}
        history={history}
      />
    );

    const toggleObj = wrapper
      .find('Grid')
      .children()
      .find('Table')
      .children()
      .find('tbody')
      .childAt(2)
      .childAt(0)
      .childAt(0)
      .childAt(0);
    toggleObj.simulate('change');
    e(onToggleObject.calledOnce).to.equal(true);
  });
});
