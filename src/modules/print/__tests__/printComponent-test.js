import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import { ChooseTemplate } from '../PrintTemplateComponent';
import { AppSession } from '../../app/appSession';
import sinon from 'sinon';

describe('PrintTemplateComponent', () => {
  it('should display correctly', () => {
    const clearAll = sinon.spy();
    const loadTemplates = sinon.spy();
    const clearRendered = sinon.spy();
    const renderTemplate = sinon.spy();
    const wrapper = shallow(<ChooseTemplate
        clearAll={clearAll}
        clearRendered={clearRendered}
        loadTemplates={loadTemplates}
        renderTemplate={renderTemplate}
        appSession={new AppSession({ accessToken: '1234' })}
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
          }],
          rendered: '<html>Some html</html>'
        }}
        marked={[
            {nodeId: 1, name: 'Test 1'},
            {nodeId: 2, name: 'Test 2'}
        ]}
    />);
    expect(clearAll.calledOnce).toBe(true);
    expect(loadTemplates.calledOnce);
    expect(loadTemplates.getCall(0).args[0].token).toBe('1234');
    expect(clearRendered.calledOnce).toBe(false);
    wrapper.find('select').simulate('change', { target: { value : 1}});
    expect(clearRendered.calledOnce).toBe(true);
    expect(renderTemplate.calledOnce).toBe(true);
    expect(renderTemplate.getCall(0).args[0].token).toBe('1234');
    expect(renderTemplate.getCall(0).args[0].codeFormat).toBe(1);
    expect(renderTemplate.getCall(0).args[0].templateId).toBe(1);
    expect(renderTemplate.getCall(0).args[0].nodes).toEqual([
      {
        uuid: 1, name: 'Test 1'
      },
      {
        uuid: 2, name: 'Test 2'
      }
    ]);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});