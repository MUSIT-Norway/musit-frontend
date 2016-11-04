import { shallow } from 'enzyme';
import MusitField from '../../../../components/formfields/musitfield';
import MusitDropDownField from '../../../../components/formfields/musitdropdownfield';
import React from 'react';
import ObservationPest from '../ObservationPest';
import ObservationDoubleTextAreaComponent from '../ObservationDoubleTextAreaComponent';
import { ControlLabel } from 'react-bootstrap';

describe('ObservationPest', () => {

  it('renders observations', () => {
    const wrapper = shallow(
      <ObservationPest
        id="test"
        addIconWidth={2}
        removeIconWidth={2}
        newButtonLabel={"New"}
        newButtonOnClick={() => true}
        countLabel={"Count label"}
        countOnChange={() => true}
        countPlaceHolder={"Count placeholder"}
        countTooltip={"Count tooltip"}
        countWidth={2}
        countPrecision={0}
        countValidate={"number"}
        lifeCycleItems={[
          "Adult",
          "Puppe",
          "Whateva"
        ]}
        lifeCycleLabel={"LifeCycle label"}
        lifeCycleOnChange={() => true}
        lifeCycleOnRemove={() => true}
        lifeCyclePlaceHolder={"LifeCycle placeholder"}
        lifeCycleTooltip={"LifeCycle tooltip"}
        lifeCycleWidth={2}
        lifeCycleValidate={"text"}
        translate={(key) => key}
        commentsLeftLabel="Left label"
        commentsLeftValue="left value"
        commentsLeftTooltip="Left tooltip"
        commentsLeftPlaceHolder="Left placeholder"
        commentsLeftWidth={3}
        commentsRightPlaceHolder="Right placeholder"
        commentsOnChangeLeft={() => 'ji'}
        commentsRightLabel="Right label"
        commentsRightValue="right value"
        commentsRightTooltip="Right tooltip"
        commentsRightWidth={3}
        commentsOnChangeRight={() => 'ji'}
        observations={[
          {
            count: "1",
            lifeCycle: 'Adult'
          },
          {
            count: "20",
            lifeCycle: 'Adult'
          },
          {
            count: "10",
            lifeCycle: 'Puppe'
          }
        ]}
      />
    );
    expect(wrapper.find(ObservationDoubleTextAreaComponent).length).toEqual(1);
    expect(wrapper.find('ObservationDoubleTextAreaComponent[leftValue="left value"]').length).toEqual(1);
    expect(wrapper.find('ObservationDoubleTextAreaComponent[rightValue="right value"]').length).toEqual(1);
    expect(wrapper.find('ObservationDoubleTextAreaComponent[leftPlaceHolder="Left placeholder"]').length).toEqual(1);
    expect(wrapper.find('ObservationDoubleTextAreaComponent[rightPlaceHolder="Right placeholder"]').length).toEqual(1);
    expect(wrapper.find('ObservationDoubleTextAreaComponent[leftTooltip="Left tooltip"]').length).toEqual(1);
    expect(wrapper.find('ObservationDoubleTextAreaComponent[rightTooltip="Right tooltip"]').length).toEqual(1);
    expect(wrapper.find(MusitDropDownField).length).toEqual(3);
    expect(wrapper.find('MusitDropDownField[value="Adult"]').length).toEqual(2);
    expect(wrapper.find('MusitDropDownField[value="Puppe"]').length).toEqual(1);
    expect(wrapper.find(MusitField).length).toEqual(3);
    expect(wrapper.find('MusitField[value="1"]').length).toEqual(1);
    expect(wrapper.find('MusitField[value="10"]').length).toEqual(1);
    expect(wrapper.find('MusitField[value="20"]').length).toEqual(1);
    expect(wrapper.contains(<ControlLabel>LifeCycle label</ControlLabel>)).toEqual(true);
    expect(wrapper.contains(<ControlLabel>Count label</ControlLabel>)).toEqual(true);
    expect(wrapper.contains(<ControlLabel>LifeCycle label</ControlLabel>)).toEqual(true);
  });
});