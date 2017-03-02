import {shallow, mount} from 'enzyme';
import {shallowToJson, mountToJson} from 'enzyme-to-json';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import PickListTable from '../PickListTable';
import {PickListContainer} from '../PickListComponent';
import {AppSession} from '../../app/appSession';
import {expect as e} from 'chai';
import sinon from 'sinon';


describe('PickListComponent', () => {

  const pickList = {
    nodes: [
      {
        marked: true,
        value: {id: 1, name: 'Hei'},
        path: [1]
      },
      {
        marked: true,
        value: {id: 2, name: 'Hei'},
        path: [1, 2]
      },
      {
        marked: true,
        value: {id: 3, name: 'Hei'},
        path: [1, 3]
      },
      {
        marked: true,
        value: {id: 4, name: 'Hei'},
        path: [1, 3]
      }
    ],
    objects: [
      {
        marked: true,
        value: {
          id: 1, name: 'Test21', mainObjectId: 1,
          isMainObject: () => true
        },
        path: [1]
      },
      {
        marked: true,
        value: {
          id: 2, name: 'Test2', mainObjectId: 1,
          isMainObject: () => false
        },
        path: [1, 2]
      },
      {
        marked: false,
        value: {id: 3, name: 'Test23',
          isMainObject: () => true},
        path: [1, 3]
      }
    ]
  };


  it('Should mount', () => {

    const onToggleNode = sinon.spy();
    const onToggleObject = sinon.spy();
    const onRemoveObject = sinon.spy();
    const onRemoveNode = sinon.spy();


    const wrapper = mount(<PickListContainer
      route={{type : 'objects'}}
      pickList={pickList}
      toggleNode={onToggleNode}
      toggleObject={onToggleObject}
      toggleMainObject={(x) => x}
      removeNode={onRemoveNode}
      removeObject={onRemoveObject}
      appSession={ new AppSession()}
      refreshNode={(x) => x}
      refreshObjects={(x) => x}
      emitError={(x) => x}
      emitSuccess={(x) => x}
      iconRendrer={ (x) => x}
      classExistsOnDom={ (x) => x}
      isTypeNode={() => false}
      toggleScanner={() => true}
      scannerEnabled={true}
    />);

    expect(mountToJson(wrapper)).toMatchSnapshot();
  });

  it('should display component (nodes) correctly', () => {

    const wrapper = shallow(<PickListContainer
      route={{type : 'nodes'}}
      pickList={pickList}
      toggleNode={(x) => x}
      toggleObject={(x) => x}
      toggleMainObject={(x) => x}
      removeNode={(x) => x}
      removeObject={(x) => x}
      appSession={ new AppSession()}
      refreshNode={(x) => x}
      refreshObjects={(x) => x}
      emitError={(x) => x}
      emitSuccess={(x) => x}
      classExistsOnDom={(x) => x}
      isTypeNode={() => true}
      toggleScanner={() => true}
      scannerEnabled={true}
    />);

    expect(shallowToJson(wrapper)).toMatchSnapshot();

  });


  it('should display component (objects) correctly', () => {
    const wrapper = shallow(<PickListContainer
      route={{type : 'objects'}}
      pickList={pickList}
      toggleNode={(x) => x}
      toggleObject={(x) => x}
      toggleMainObject={(x) => x}
      removeNode={(x) => x}
      removeObject={(x) => x}
      appSession={ new AppSession()}
      refreshNode={(x) => x}
      refreshObjects={(x) => x}
      emitError={(x) => x}
      emitSuccess={(x) => x}
      classExistsOnDom={ (x) => x}
      isTypeNode={ () => false  }
      toggleScanner={() => true}
      scannerEnabled={true}
    />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });


  it('Testing functions objects', () => {

    const onToggleNode = sinon.spy();
    const onToggleObject = sinon.spy();
    const onRemoveObject = sinon.spy();
    const onRemoveNode = sinon.spy();
    const onToggleMainObject = sinon.spy();


    const wrapper = mount(<PickListContainer
      route={{type : 'objects'}}
      pickList={pickList}
      toggleNode={onToggleNode}
      toggleObject={onToggleObject}
      toggleMainObject={onToggleMainObject}
      removeNode={onRemoveNode}
      removeObject={onRemoveObject}
      appSession={ new AppSession()}
      refreshNode={(x) => x}
      refreshObjects={(x) => x}
      emitError={(x) => x}
      emitSuccess={(x) => x}
      iconRendrer={ (x) => x}
      classExistsOnDom={ (x) => x}
      isTypeNode={() => false}
      toggleScanner={() => true}
      scannerEnabled={true}
    />);

    const t = wrapper.find('Grid').children().find('Table').children().find('thead').children().find('tr').childAt(1).childAt(2);
    t.simulate('click');
    e(onRemoveObject.calledOnce).to.equal(true);

    const mo = wrapper.find('Grid').children().find('Table').children().find('tbody').childAt(0).childAt(0).childAt(0).childAt(0);
    mo.simulate('change');
    e(onToggleMainObject.calledOnce).to.equal(true);

    const o = wrapper.find('Grid').children().find('Table').children().find('tbody').childAt(2).childAt(0).childAt(0).childAt(0);
    console.log(mountToJson(o));
    o.simulate('change');
    e(onToggleObject.calledOnce).to.equal(true);
  });


  it('Testing functions nodes', () => {

    const onToggleNode = sinon.spy();
    const onToggleObject = sinon.spy();
    const onRemoveObject = sinon.spy();
    const onRemoveNode = sinon.spy();
    const onShowModal = sinon.spy();
    const onToggleScanner = sinon.spy();


    const wrapper = mount(<PickListContainer
      route={{type : 'nodes'}}
      pickList={pickList}
      toggleNode={onToggleNode}
      toggleObject={onToggleObject}
      toggleMainObject={(x) => x}
      removeNode={onRemoveNode}
      removeObject={onRemoveObject}
      appSession={new AppSession()}
      refreshNode={(x) => x}
      refreshObjects={(x) => x}
      emitError={(x) => x}
      emitSuccess={(x) => x}
      iconRendrer={ (x) => x}
      classExistsOnDom={ (x) => x}
      isTypeNode={() => true}
      toggleScanner={onToggleScanner}
      scannerEnabled={true}
      showModal={onShowModal}
    />);


    const scanButton = wrapper.find('Grid').childAt(0).childAt(0).childAt(0).childAt(1).childAt(0);
    //console.log(mountToJson(scanButton));
    scanButton.simulate('click');
    e(onToggleScanner.calledOnce).to.equal(true);


    const a = wrapper.find('Grid').children().find('Table').children().find('thead').children().find('tr').childAt(0).childAt(0);
    a.simulate('change');
    e(onToggleNode.calledOnce).to.equal(true);


    const a0 = wrapper.find('Grid').children().find('Table').children().find('thead').children().find('tr').childAt(1).childAt(2);
    a0.simulate('click');
    e(onShowModal.calledOnce).to.equal(true);


    const b = wrapper.find('Grid').children().find('Table').children().find('thead').children().find('tr').childAt(1).childAt(4);
    b.simulate('click');
    e(onRemoveNode.calledOnce).to.equal(true);


  });
});


describe('PickListTable', () => {
  it('should display node-picklist correctly', () => {
    const pickList = [{value: 'Hei', marked: true, path: 'hei'}, {
      value: 'Hei',
      marked: false,
      isMainObject: true,
      path: 'hei'
    }, {value: 'Hei', marked: false, path: 'hei'}];
    const marked = pickList.filter(p => p.marked);
    const markedValues = marked.map(p => p.value);

    const wrapper = shallow(<PickListTable
      picks={pickList}
      marked={markedValues}
      isnode={true}
      move={(x) => x}
      print={(p) => p}
      toggle={(t)=> t}
      remove={(r)=> r}
      iconRendrer={(pick) => (pick.value.name ? <FontAwesome name="folder"/> :
                                  <span className='icon icon-musitobject'/>)
              }
      labelRendrer={(pick) => {
        return (
                  <div>
                    {null}
                    {null}
                    <span style={{ paddingLeft: '1em' }}>{pick.value.name ? pick.value.name : pick.value.term}</span>
                    <div className="labelText">
                    </div>
                  </div>
                );
      }}
    />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should display node-picklist correctly', () => {
    const pickList = [{marked: false, value: {id: 1}, path: [{id: 6, name: 'Code from Jarl', url: '/magasin/6'}]},
      {marked: true, value: {id: 2}, path: [{id: 6, name: 'Code from Jarl', url: '/magasin/6'}]}
    ];
    const marked = pickList.filter(p => p.marked);
    const markedValues = marked.map(p => p.value);

    const onMove = sinon.spy();
    const onPrint = sinon.spy();

    const onToggle = sinon.spy();

    const onRemove = sinon.spy();

    const wrapper = shallow(<PickListTable
      picks={pickList}
      marked={markedValues}
      isnode={true}
      move={onMove}
      print={onPrint}
      toggle={onToggle}
      remove={onRemove}
      iconRendrer={(pick) => (pick.value.name ? <FontAwesome name="folder"/> :
                                  <span className='icon icon-musitobject'/>)
              }
      labelRendrer={(pick) => {
        return (
                  <div>
                    {null}
                    {null}
                    <span style={{ paddingLeft: '1em' }}>{pick.value.name ? pick.value.name : pick.value.term}</span>
                    <div className="labelText">
                    </div>
                  </div>
                );
      }}
    />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
    e(wrapper.find('div').find('Table').find('tbody').find('tr')).to.have.length(pickList.length);

    const b = wrapper.find({name: 'print'}).first();
    b.simulate('click');
    e(onPrint.called).to.equal(true);

    const a = wrapper.find({name: 'truck'});
    a.simulate('click');
    e(onMove.called).to.equal(true);

    const c = wrapper.find({name: 'remove'}).first();
    c.simulate('click');
    e(onRemove.called).to.equal(true);

  });

  it('should display object-picklist correctly', () => {
    const pickList = [{marked: false, value: {id: 1}, path: [{id: 6, name: 'Code from Jarl', url: '/magasin/6'}]},
      {marked: true, value: {id: 2}, path: [{id: 6, name: 'Code from Jarl', url: '/magasin/6'}]}
    ];
    const marked = pickList.filter(p => p.marked);
    const markedValues = marked.map(p => p.value);

    const onMove = sinon.spy();
    const onPrint = sinon.spy();

    const onToggle = sinon.spy();

    const onRemove = sinon.spy();

    const wrapper = shallow(<PickListTable
      picks={pickList}
      marked={markedValues}
      isnode={false}
      move={onMove}
      print={onPrint}
      toggle={onToggle}
      remove={onRemove}
      iconRendrer={(pick) => (pick.value.name ? <FontAwesome name="folder"/> :
                                  <span className='icon icon-musitobject'/>)
              }
      labelRendrer={(pick) => {
        return (
                  <div>
                    {null}
                    {null}
                    <span style={{ paddingLeft: '1em' }}>{pick.value.name ? pick.value.name : pick.value.term}</span>
                    <div className="labelText">
                    </div>
                  </div>
                );
      }}
    />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
    e(wrapper.find('div').find('Table').find('tbody').find('tr')).to.have.length(pickList.length);

    const b = wrapper.find({name: 'print'}).first();
    b.simulate('click');
    e(onPrint.called).to.equal(false);

    const a = wrapper.find({name: 'truck'});
    a.simulate('click');
    e(onMove.called).to.equal(true);

    const c = wrapper.find({name: 'remove'}).first();
    c.simulate('click');
    e(onRemove.called).to.equal(true);

  });

});