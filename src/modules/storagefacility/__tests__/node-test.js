import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import sinon from 'sinon';
import React from 'react';
import NodeLeftMenuComponent from '../TableLeftMenu';
import NodeDetails from '../NodeDetails';

describe('NodeLeftMenuComponent', () => {

  it('renders properly', () => {
    const wrapper = shallow(
      <NodeLeftMenuComponent
        showNewNode={true}
        translate={(key) => key}
        onClickNewNode={(key) => key}
        stats={{
          numNodes: 11,
          numObjects: 5,
          totalObjects: 78
        }}
        showButtons
        onClickProperties={(key) => key}
        onClickControlObservations={(key) => key}
        onClickObservations={(key) => key}
        onClickController={(key) => key}
        onClickMoveNode={(key) => key}
        onClickDelete={(key) => key}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});


describe ('NodePanel' ,() => {

  it('should render properly ', () => {

    const wrapper = shallow(
      <NodeDetails
        unit={{
          name: 'NHM',
          type: 'Organisation',
          address: 'Sars gate 11',
          area: '10',
          areaTo: '12',
          height: '3',
          heightTo:'5',
          lastUpdateBy: 'Jarl André Hübenthal',
          lastUpdateDate: '12.01.2001',
          environmentRequirement: {
            temperature: '12',
            temperatureTolerance: '3',
            relativeHumidity: '67',
            relativeHumidityTolerance: '8',
            hypoxicAir: '23',
            hypoxicAirTolerance: '2',
            cleaning: 'Urent',
            lightingCondition: 'For mørkt',
            comments: 'Hei hei'},
          securityAssessment: {
            perimeter:true,
            theftProtection: false,
            fireProtection: true,
            waterDamage: true,
            routinesAndContingencyPlan: false
          },
          environmentAssessment: {
            relativeHumidity: true,
            lightingCondition: false,
            temperature: true,
            preventiveConservation: true
          }
        }}
        onLagreClick={(k) => k}
        loaded={true}
        updateState={(k) => k}/>
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });


  it('Testing buttons', () => {
    const onLagreClick = sinon.spy();
    const updateState = sinon.spy();
    const onClickSave = sinon.spy();
    const wrapper = shallow(<NodeDetails
      onLagreClick={onLagreClick}
      updateState={updateState}
      unit={{
        name: 'NHM',
        type: 'Organisation',
        address: 'Sars gate 11',
        area: '10',
        areaTo: '12',
        height: '3',
        heightTo:'5',
        lastUpdateBy: 'Jarl André Hübenthal',
        lastUpdateDate: '12.01.2001',
        environmentRequirement: {
          temperature: '12',
          temperatureTolerance: '3',
          relativeHumidity: '67',
          relativeHumidityTolerance: '8',
          hypoxicAir: '23',
          hypoxicAirTolerance: '2',
          cleaning: 'Urent',
          lightingCondition: 'For mørkt',
          comments: 'Hei hei'},
        securityAssessment: {
          perimeter:true,
          theftProtection: false,
          fireProtection: true,
          waterDamage: true,
          routinesAndContingencyPlan: false
        },
        environmentAssessment: {
          relativeHumidity: true,
          lightingCondition: false,
          temperature: true,
          preventiveConservation: true
        }
      }}
      loaded={true}/>
    );
    wrapper.find('SaveCancel').simulate('click');
    expect(onClickSave.calledOnce).toBe(true);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

});
