import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import { ChooseTemplate } from '../PrintTemplateComponent';
import { AppSession } from '../../app/appSession';

describe('PrintTemplateComponent', () => {
  it('should display correctly', () => {
    const wrapper = shallow(<ChooseTemplate
            clearAll={() => true}
            clearRendered={() => true}
            loadTemplates={() => true}
            renderTemplate={() => true}
            appSession={new AppSession({})}
            store={{
              templates: [{
                'id': 1,
                'name': 'Label-1 70mm x 37mm',
                'labelWidth': 70,
                'labelHeight': 37,
                'colsPerPage': 3,
                'rowsPerPage': 8
              }, {
                'id': 2,
                'name': 'Label-2 105mm x 74mm',
                'labelWidth': 105,
                'labelHeight': 74,
                'colsPerPage': 2,
                'rowsPerPage': 4
              }]
            }}
            marked={[
                {nodeId: 1, name: 'Test 1'},
                {nodeId: 2, name: 'Test 2'}
            ]}
        />);
    wrapper.find('select').simulate('change', { target: { value : 1}});
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});