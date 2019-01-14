import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import { ViewObservationPage } from '../ViewObservationPage';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Render view observation page', () => {
  it('should set default date and have correct date format', () => {
    const getObservation = sinon.spy();
    const setLoading = sinon.spy();
    const loadRootNode = sinon.spy();
    shallow(
      <ViewObservationPage
        goBack={() => {}}
        store={{
          rootNode: null,
          data: {
            doneBy: 'Jarl',
            doneDate: '2017-02-08T11:14:25.889Z',
            registeredBy: 'Jarl',
            registeredDate: '2017-02-08T11:14:25.889Z',
            observations: [
              {
                type: 'gas',
                data: {
                  leftValue: 'pppppppppppppppp',
                  rightValue: undefined
                }
              },
              {
                type: 'lightCondition',
                data: {
                  leftValue: 'pppppppppppppppp',
                  rightValue: undefined
                }
              },
              {
                type: 'cleaning',
                data: {
                  leftValue: 'pppppppppppppppp',
                  rightValue: undefined
                }
              },
              {
                type: 'mold',
                data: {
                  leftValue: 'pppppppppppppppp',
                  rightValue: undefined
                }
              },
              {
                type: 'skallsikring',
                data: {
                  leftValue: 'pppppppppppppppp',
                  rightValue: undefined
                }
              },
              {
                type: 'tyverisikring',
                data: {
                  leftValue: 'pppppppppppppppp',
                  rightValue: undefined
                }
              },
              {
                type: 'brannsikring',
                data: {
                  leftValue: 'pppppppppppppppp',
                  rightValue: undefined
                }
              },
              {
                type: 'vannskaderisiko',
                data: {
                  leftValue: 'pppppppppppppppp',
                  rightValue: undefined
                }
              },
              {
                type: 'pest',
                data: {
                  identificationValue: 'kkk',
                  observations: [
                    {
                      lifeCycle: 'puppe',
                      count: '6'
                    }
                  ]
                }
              }
            ]
          }
        }}
        match={{
          params: {
            id: '1',
            obsId: 45
          }
        }}
        appSession={{
          accessToken: '1234',
          museumId: 99
        }}
        getObservation={getObservation}
        loadRootNode={loadRootNode}
        setLoading={setLoading}
        mode="ADD"
        id="1"
      />
    );
    expect(getObservation.callCount).toBe(1);
    expect(loadRootNode.callCount).toBe(1);
    expect(setLoading.callCount).toBe(1);
  });
});
