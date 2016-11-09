import { shallow } from 'enzyme';
import MusitField from '../../../../components/formfields/musitfield';
import MusitDropDownField from '../../../../components/formfields/musitdropdownfield';
import React from 'react';
import { RenderPest } from '../index';
import ObservationDoubleTextAreaComponent from '../ObservationDoubleTextAreaComponent';
import { ControlLabel } from 'react-bootstrap';

describe('RenderPest', () => {
  const observations = [
    {
      count: '1',
      lifeCycle: 'adult'
    },
    {
      count: "20",
      lifeCycle: "puppe"
    },
    {
      count: "10",
      lifeCycle: "larva"
    }
  ];

  const ValueProps = {
    observations : observations,
    identificationValue : "Identification value.",
    commentValue : "Comment value."
  };

  const layoutProps = {
    lifeCycleWidth: 2,
    countWidth: 2,
    removeIconWidth: 1,
    addIconWidth: 1,
    commentsLeftWidth: 5,
    commentsRightWidth: 5
  };

  it('renders pest observation', () => {
    const wrapper = shallow(
      <RenderPest
        index={1}
        valueProps={ValueProps}
        disabled={false}
        layoutProps={layoutProps}
      />
    );
    // console.log(wrapper);
    // console.log(wrapper.find(ObservationDoubleTextAreaComponent).length);
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