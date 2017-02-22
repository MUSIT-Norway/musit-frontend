import {shallow} from 'enzyme';
import {shallowToJson} from 'enzyme-to-json';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import PickListTable from '../PickListTable';
import PickListComponent from '../PickListComponent';
import { AppSession } from '../../app/appSession';
//import sinon from 'sinon';


describe('PickListComponent', () => {

  const  pickList={
    nodes: [
      {
        marked: false,
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


    const wrapper = shallow(<PickListComponent
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
    />);

    expect(shallowToJson(wrapper)).toMatchSnapshot();

  });



  it('should display component (objects) correctly', () => {


    const wrapper = shallow(<PickListComponent
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
    />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
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

    const wrapper = shallow(<PickListTable
      picks={pickList}
      marked={markedValues}
      isnode={false}
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
});

describe('Check detail values for piclistTable', ()=> {
  const  pickList={
    nodes: [
      {
        marked: false,
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

  it('should display component (objects) correctly', () => {


    const wrapper = shallow(<PickListComponent
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
    />);

    console.log(wrapper.children());



  });




});
