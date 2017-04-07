import { shallow } from 'enzyme';
import { RenderDoubleTextArea, RenderPest } from '../render';
import React from 'react';
import ObservationPage from '../ObservationPage';

describe('Render oobservation page in edit mode', () => {
  it('should set default date and have correct date format', () => {
    const observationPage = shallow(
      <ObservationPage
        observations={[
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
        ]}
        doneBy={{ dataportenId: '12345', fn: 'Jarl' }}
        onSaveObservation={() => true}
        doneDate={'2016-12-23T00:00:00.000Z'}
        mode="EDIT"
        id="1"
      />
    );
    expect(observationPage.find(RenderDoubleTextArea).length).toBe(8);
    expect(observationPage.find(RenderPest).length).toBe(1);
  });
});
