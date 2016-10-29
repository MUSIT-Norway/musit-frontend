import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json';
import React from 'react'
import ControlViewContainer from '../index'

describe('Render view control page', () => {

  it('should set default date and have correct date format for doneDate', () => {
    const wrapper = shallow(
      <ControlViewContainer
        translate={(key) => key}
        saveControl={() => true}
        loadControl={() => true}
        doneBy={{
          id: 1,
          fn: 'Jarl'
        }}
        params={{

        }}
        controls={{
          data: {
            doneBy: { id: 1, fn: 'Arne And' },
            doneDate: new Date(2016, 30, 1).toISOString(),
            registeredBy: 'Stein Olsen',
            registeredDate: new Date(2016, 30, 1).toISOString()
          }
        }}
        rootNode={{
          path: ',1,'
        }}
        loadPersonNameFromId={() => true}
      />
    )
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})
