import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import ModalNodeGrid from '../ModalMoveHistoryGrid';
import { MoveHistoryComponent } from '../MoveHistoryComponent';
import sinon from 'sinon';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('MoveHistoryComponent', () => {
  it('should call clear and load', () => {
    const clear = sinon.spy();
    const loadMoveHistory = sinon.spy();
    mount(
      <MoveHistoryComponent
        objectId="1234"
        clear={clear}
        loadMoveHistory={loadMoveHistory}
        moveHistoryStore={{
          data: [
            {
              doneDate: '2017-02-13T23:28:02+01:00',
              doneBy: 'Jarl',
              from: {
                breadcrumb: []
              },
              to: {
                breadcrumb: []
              }
            }
          ]
        }}
        appSession={{
          museumId: 99,
          accessToken: '1234-1234-1234'
        }}
      />
    );
    expect(clear.callCount).toBe(1);
    expect(loadMoveHistory.callCount).toBe(1);
    expect(loadMoveHistory.getCall(0).args[0].token).toBe('1234-1234-1234');
    expect(loadMoveHistory.getCall(0).args[0].museumId).toBe(99);
    expect(loadMoveHistory.getCall(0).args[0].objectId).toBe('1234');
  });
});

describe('MoveHistory', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <ModalNodeGrid
        onClick={key => key}
        tableData={[
          {
            doneDate: '2017-01-20T21:11:28+01:00',
            doneBy: 'Jarl',
            from: {
              breadcrumb: [
                {
                  nodeId: 1,
                  name: 'Tull',
                  url: '/magasin/1'
                }
              ]
            },
            to: {
              breadcrumb: [
                {
                  nodeId: 2,
                  name: 'Rull',
                  url: '/magasin/2'
                }
              ]
            }
          },
          {
            doneDate: '2017-01-20T21:11:28+01:00',
            doneBy: 'Jarl',
            from: {
              breadcrumb: [
                {
                  nodeId: 1,
                  name: 'Tull',
                  url: '/magasin/1'
                }
              ]
            },
            to: {
              breadcrumb: [
                {
                  nodeId: 2,
                  name: 'Rull',
                  url: '/magasin/2'
                }
              ]
            }
          },
          {
            doneDate: '2017-01-20T21:11:28+01:00',
            doneBy: 'Jarl',
            from: {
              breadcrumb: [
                {
                  nodeId: 1,
                  name: 'Tull',
                  url: '/magasin/1'
                }
              ]
            },
            to: {
              breadcrumb: [
                {
                  nodeId: 2,
                  name: 'Rull',
                  url: '/magasin/2'
                }
              ]
            }
          }
        ]}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
