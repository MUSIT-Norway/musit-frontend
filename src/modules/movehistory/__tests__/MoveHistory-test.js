import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import ModalNodeGrid from '../ModalMoveHistoryGrid';

describe('MoveHistory', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <ModalNodeGrid
        onClick={(key) => key}
        tableData={[
          {
            doneDate: '2017-01-29T21:11:28+01:00',
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
            doneDate: '2017-01-29T21:11:28+01:00',
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