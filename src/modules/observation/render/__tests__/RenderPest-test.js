import { render } from 'enzyme';
import React from 'react';
import { RenderPest } from '..';

describe('RenderPest', () => {
  let wrapper;
  beforeEach(() => {
    const observations = [
      {
        count: '1',
        lifeCycle: 'adult'
      },
      {
        count: '20',
        lifeCycle: 'puppe'
      },
      {
        count: '10',
        lifeCycle: 'larva'
      }
    ];

    const ValueProps = {
      observations: observations,
      identificationValue: 'Identification value.',
      commentValue: 'Comment value.'
    };

    const layoutProps = {
      lifeCycleWidth: 2,
      countWidth: 2,
      removeIconWidth: 1,
      addIconWidth: 1,
      commentsLeftWidth: 5,
      commentsRightWidth: 5
    };

    wrapper = render(
      <RenderPest
        index={1}
        valueProps={ValueProps}
        disabled={false}
        layoutProps={layoutProps}
        canEdit={false}
      />
    );
  });

  it('Create two textarea components', () => {
    expect(wrapper.find('textarea').length).toBe(2);
  });
  it('Create input components', () => {
    expect(wrapper.find('input').length).toBe(6);
  });
  it('Check Puppe', () => {
    expect(wrapper.text().includes('Puppe')).toBe(true);
  });
  it('Check Larva', () => {
    expect(wrapper.text().includes('Larve')).toBe(true);
  });
  it('Check Adult', () => {
    expect(wrapper.text().includes('Adult')).toEqual(true);
  });
  it('Check identification label', () => {
    expect(wrapper.text().includes('Identifikasjon')).toEqual(true);
  });
  it('Check comment label', () => {
    expect(wrapper.text().includes('Tiltak/Kommentar')).toEqual(true);
  });
  it('Check count label', () => {
    expect(wrapper.text().includes('Antall')).toEqual(true);
  });
  it('Create input value 1', () => {
    expect(wrapper.find('input[value="1"]').length).toBe(1);
  });
  it('Create input value 20', () => {
    expect(wrapper.find('input[value="20"]').length).toBe(1);
  });
  it('Create input value 10', () => {
    expect(wrapper.find('input[value="10"]').length).toBe(1);
  });
  it('Check Identification value.', () => {
    expect(wrapper.text().includes('Identification value.')).toEqual(true);
  });
  it('Check Comment value', () => {
    expect(wrapper.text().includes('Comment value.')).toEqual(true);
  });
});
