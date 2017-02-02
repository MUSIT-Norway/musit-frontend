import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import ReportsOverview from '../ReportsOverview';
import { KDReport } from '../KDReportComponent';

describe('Reports overview', () => {
  it('should display correctly', () => {
    const wrapper = shallow(<ReportsOverview />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});

describe('KDReportComponent', () => {
  it('should display correctly', () => {
    const wrapper = shallow(<KDReport
      data={{
        totalArea: 1.23,
        perimeterSecurity: 23.34,
        theftProtection: 234.2,
        fireProtection: 34.3,
        waterDamageAssessment: 234.3,
        routinesAndContingencyPlan: 2334.3
      }}
      appSession={{ getAccessToken : () => 'xxxx-xxxx-xxxx-xxxx', getMuseumId: () => 1 }}
      loadKDReport={() => true}
    />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});