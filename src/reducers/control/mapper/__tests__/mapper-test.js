import {
  mapToBackend
} from '../to_backend';

describe('ControlMapperReducer', () => {
  it('maps to correct backend structure with no observations', () => {
    const state = {
      doneBy: 'f4e1eba9-8add-4675-9836-db59f7115d7c',
      doneDate: '2016-10-31T23:00:00.000Z',
      temperatureOK: true,
      hypoxicAirOK: false,
      gasOK: true,
      cleaningOK: true,
      relativeHumidityOK: true,
      lightConditionOK: false,
      alcoholOK: true,
      pestOK: false,
      moldOK: true
    };
    const nodeId = 54;
    const observations = {
      observations: [
        {
          type: 'hypoxicAir',
          data: {

          }
        },
        {
          type: 'lightCondition',
          data: {
            leftValue: 'Some light'
          }
        },
        {
          type: 'pest',
          data: {
            observations: []
          }
        }
      ]
    };
    const transformed = mapToBackend(state, observations, nodeId);
    expect(transformed).toMatchSnapshot();
  });
});
