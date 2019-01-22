import { mount } from 'enzyme';
import { mountToJson } from 'enzyme-to-json';
import React from 'react';
import sinon from 'sinon';
import { PrintTemplateComponent } from '../PrintTemplateComponent';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('PrintTemplateComponent', () => {
  it('should display correctly', () => {
    const clearAll = sinon.spy();
    const loadTemplates = sinon.spy();
    const clearRendered = sinon.spy();
    const renderTemplate = sinon.spy();
    const setTemplateId = sinon.spy();
    const writeToDocument = sinon.spy();
    const setLevel = sinon.spy();
    const store = {
      templates: [
        {
          id: 1,
          name: 'Label-1 70mm x 37mm',
          labelWidth: 70,
          labelHeight: 37,
          colsPerPage: 3,
          rowsPerPage: 8
        },
        {
          id: 4,
          name: 'Label-2 105mm x 74mm',
          labelWidth: 105,
          labelHeight: 74,
          colsPerPage: 2,
          rowsPerPage: 4
        }
      ],
      rendered: '<html>Some html</html>'
    };
    const wrapper = mount(
      <PrintTemplateComponent
        clearAll={clearAll}
        clearRendered={clearRendered}
        loadTemplates={loadTemplates}
        renderTemplate={renderTemplate}
        setTemplateId={setTemplateId}
        writeToDocument={writeToDocument}
        setLevel={setLevel}
        appSession={{ accessToken: '1234' }}
        store={store}
        marked={[
          {
            path: [
              { id: 1, name: 'Utviklingsmuseet', url: '/magasin/1' },
              { id: 3, name: 'Utviklingsmuseet Org', url: '/magasin/3' },
              { id: 4, name: 'Forskningens hus', url: '/magasin/4' },
              { id: 7, name: 'Forskningsværelset', url: '/magasin/7' },
              { id: 61, name: 'kkk', url: '/magasin/61' }
            ],
            value: {
              nodeId: 1,
              name: 'Test 1'
            }
          },
          {
            path: [
              { id: 1, name: 'Utviklingsmuseet', url: '/magasin/1' },
              { id: 3, name: 'Utviklingsmuseet Org', url: '/magasin/3' }
            ],
            value: {
              nodeId: 2,
              name: 'Test 2'
            }
          },
          {
            path: [],
            value: {
              nodeId: 25,
              name: 'Test 3'
            }
          }
        ]}
      />
    );
    expect(clearAll.calledOnce).toBe(true);
    expect(loadTemplates.calledOnce).toBe(true);
    expect(loadTemplates.getCall(0).args[0].token).toBe('1234');
    expect(clearRendered.calledOnce).toBe(false);
    wrapper.find('select.template').simulate('change', { target: { value: 4 } });
    expect(clearRendered.callCount).toBe(1);
    expect(renderTemplate.callCount).toBe(1);
    expect(renderTemplate.getCall(0).args[0].token).toBe('1234');
    expect(renderTemplate.getCall(0).args[0].codeFormat).toBe(2);
    expect(renderTemplate.getCall(0).args[0].templateId).toBe(4);
    expect(renderTemplate.getCall(0).args[0].nodes).toEqual([
      {
        uuid: 1,
        name:
          'Utviklingsmuseet / Utviklingsmuseet Org / Forskningens hus / Forskningsværelset / kkk / Test 1'
      },
      { uuid: 2, name: 'Utviklingsmuseet / Utviklingsmuseet Org / Test 2' },
      { uuid: 25, name: 'Test 3' }
    ]);
    wrapper.setProps({ store: { ...store, templateId: 4 } });
    wrapper.find('select.level').simulate('change', { target: { value: -2 } });
    expect(clearRendered.callCount).toBe(2);
    expect(renderTemplate.callCount).toBe(2);
    expect(renderTemplate.getCall(1).args[0].token).toBe('1234');
    expect(renderTemplate.getCall(1).args[0].codeFormat).toBe(2);
    expect(renderTemplate.getCall(1).args[0].templateId).toBe(4);
    expect(renderTemplate.getCall(1).args[0].nodes).toEqual([
      { uuid: 1, name: 'Forskningsværelset / kkk / Test 1' },
      { uuid: 2, name: 'Utviklingsmuseet / Utviklingsmuseet Org / Test 2' },
      { uuid: 25, name: 'Test 3' }
    ]);

    expect(mountToJson(wrapper)).toMatchSnapshot();
  });
});
