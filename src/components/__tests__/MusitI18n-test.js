// @flow

import React from 'react';
import { shallow } from 'enzyme';

import { MusitI18n } from '../MusitI18n';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('MusitI18n', () => {
  it('should render english text', () => {
    const Comp = shallow(
      <MusitI18n
        en="Eng"
        no="Nor"
        appSession={{ language: { isEn: true, isNo: false } }}
      />
    );

    expect(Comp.text()).toEqual('Eng');
  });

  it('should render norwegian text', () => {
    const Comp = shallow(
      <MusitI18n
        en="Eng"
        no="Nor"
        appSession={{ language: { isEn: false, isNo: true } }}
      />
    );

    expect(Comp.text()).toEqual('Nor');
  });

  it('should fail to render if no language is selected', () => {
    const run = () => {
      try {
        shallow(
          <MusitI18n
            en="Eng"
            no="Nor"
            appSession={{ language: { isEn: false, isNo: false } }}
          />
        );
      } catch (err) {
        return err.message;
      }
    };

    expect(run()).toEqual('No language selected');
  });
});
