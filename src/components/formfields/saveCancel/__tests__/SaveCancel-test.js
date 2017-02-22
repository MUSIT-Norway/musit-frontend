import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import React from 'react';
import SaveCancel from '../SaveCancel';

describe('SaveCancel', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <SaveCancel
        onClickSave={(a) => (a)}
        onClickCancel={(a) => (a)}
        saveDisabled={(a) => (a)}
        cancelDisabled={(a) => (a)}
      />
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
