import {shallow, mount} from 'enzyme';
import {shallowToJson, mountToJson} from 'enzyme-to-json';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import PickListTable from '../PickListTable';
import { PickListContainer } from '../PickListComponent';
import { AppSession } from '../../app/appSession';
import { expect as e } from 'chai';
import sinon from 'sinon';


describe('PickListComponent', () => {

  const  pickList={
    nodes: [
      {
        marked: true,
        value: {id: 1, name: 'Hei'},
        path: [1]
      },
      {
        marked: false,
        value: {id: 2, name: 'Hei'},
        path: [1,2]
      },
      {
        marked: true,
        value: {id: 3, name: 'Hei'},
        path: [1,3]
      }
    ],
    objects: [
      {
        marked: false,
        value: {id: 1,  name: 'Test21'},
        path: [1]
      },
      {
        marked: true,
        value: {id: 2, mainObjectId: 1, name: 'Test2'},
        isMainObject: () => true,
        path: [1,2]
      },
      {
        marked: false,
        value: {id: 3, name: 'Test23'},
        path: [1,3]
      }
    ]
  };

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
      classExistsOnDom={ (x) => x}
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
    />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('Testing functions', () => {

    const onToggleNode = sinon.spy();
    const onToggleObject = sinon.spy();



    const wrapper = mount(<PickListContainer
      route={{type : 'objects'}}
      pickList={pickList}
      toggleNode={onToggleNode}
      toggleObject={onToggleObject}
      toggleMainObject={(x) => x}
      removeNode={(x) => x}
      removeObject={(x) => x}
      appSession={ new AppSession()}
      refreshNode={(x) => x}
      refreshObjects={(x) => x}
      emitError={(x) => x}
      emitSuccess={(x) => x}
      iconRendrer={ (x) => x}
      classExistsOnDom={ (x) => x}
    />);


    const t = wrapper.find('Grid').children(0).find('div');

    console.log(mountToJson(t));
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