import { shallow } from 'enzyme'
import MusitTextArea from '../../../../components/formfields/musittextarea'
import React from 'react'
import ObservationDoubleTextAreaComponent from '../ObservationDoubleTextAreaComponent';
import { ControlLabel } from 'react-bootstrap'

describe('ObservationDoubleTextAreaComponent', () => {

  it('renders two textareas', () => {
    const wrapper = shallow(
      <ObservationDoubleTextAreaComponent
        id="test"
        translate={(key) => key}
        leftLabel="Left label"
        leftValue="left value"
        leftTooltip="Left tooltip"
        leftPlaceHolder="Left placeholder"
        leftWidth={3}
        rightPlaceHolder="Right placeholder"
        onChangeLeft={() => 'ji'}
        rightLabel="Right label"
        rightValue="right value"
        rightTooltip="Right tooltip"
        rightWidth={3}
        onChangeRight={() => 'ji'}
      />
    );
    expect(wrapper.find(MusitTextArea).length).toEqual(2)
    expect(wrapper.find('MusitTextArea[value="left value"]').length).toEqual(1)
    expect(wrapper.find('MusitTextArea[value="right value"]').length).toEqual(1)
    expect(wrapper.find('MusitTextArea[placeHolder="Left placeholder"]').length).toEqual(1)
    expect(wrapper.find('MusitTextArea[placeHolder="Right placeholder"]').length).toEqual(1)
    expect(wrapper.find('MusitTextArea[tooltip="Left tooltip"]').length).toEqual(1)
    expect(wrapper.find('MusitTextArea[tooltip="Right tooltip"]').length).toEqual(1)
    expect(wrapper.contains(<ControlLabel>Left label<span style={{ color: 'red' }}>*</span></ControlLabel>)).toEqual(true)
    expect(wrapper.contains(<ControlLabel>Right label</ControlLabel>)).toEqual(true)
  })
})
