import React from 'react';
import Toolbar from '../Toolbar';
import { shallow } from 'enzyme';
import FontAwesome from 'react-fontawesome';
import { MusitField } from '../../formfields';
import { Button } from 'react-bootstrap';

describe('Toolbar', () => {
  const leftLabel = 'Left';
  const clickShowLeft = () => false;
  const centerLabel = 'Center';
  const clickShowCenter = () => false;
  const rightLabel = 'Right';
  const clickShowRight = () => false;

  it('should create a toolbar with Left toolbar item active', () => {
    const showLeft = true;
    const showCenter = false;
    const showRight = false;
    const wrapper = shallow(
      <Toolbar
        clickShowRight={clickShowRight}
        labelRight={rightLabel}
        showRight={showRight}
        clickShowLeft={clickShowLeft}
        clickShowCenter={clickShowCenter}
        labelLeft={leftLabel}
        labelCenter={centerLabel}
        showLeft={showLeft}
        showCenter={showCenter}
        onSearchChanged={() => false}
        placeHolderSearch="Search here"
        searchValue=""
      />
    );
    expect(
      wrapper.contains(
        <Button active={showLeft} onClick={clickShowLeft}>
          <FontAwesome name={'check-square-o'} /> {leftLabel}
        </Button>
      )
    ).toBe(true);
    expect(
      wrapper.contains(
        <Button active={showCenter} onClick={clickShowCenter}>
          <FontAwesome name={'square-o'} /> {centerLabel}
        </Button>
      )
    ).toBe(true);
    expect(wrapper.contains('Search here')).toBe(false); // placeholder, not a direct text
    expect(wrapper.find(MusitField).length).toBe(1);
  });

  it('should create a toolbar with Center toolbar item active', () => {
    const showLeft = false;
    const showCenter = true;
    const showRight = false;
    const wrapper = shallow(
      <Toolbar
        clickShowRight={clickShowRight}
        labelRight={rightLabel}
        showRight={showRight}
        clickShowLeft={clickShowLeft}
        clickShowCenter={clickShowCenter}
        labelLeft={leftLabel}
        labelCenter={centerLabel}
        showLeft={showLeft}
        showCenter={showCenter}
        onSearchChanged={() => false}
        placeHolderSearch="Search here"
        searchValue=""
      />
    );
    expect(
      wrapper.contains(
        <Button active={showLeft} onClick={clickShowLeft}>
          <FontAwesome name={'square-o'} /> {leftLabel}
        </Button>
      )
    ).toBe(true);
    expect(
      wrapper.contains(
        <Button active={showCenter} onClick={clickShowCenter}>
          <FontAwesome name={'check-square-o'} /> {centerLabel}
        </Button>
      )
    ).toBe(true);
    expect(wrapper.contains('Search here')).toBe(false); // placeholder, not a direct text
    expect(wrapper.find(MusitField).length).toBe(1);
  });

  it('should create a toolbar without search bar if onSearchChanged is not provided', () => {
    const showLeft = false;
    const showCenter = true;
    const showRight = false;
    const wrapper = shallow(
      <Toolbar
        clickShowRight={clickShowRight}
        labelRight={rightLabel}
        showRight={showRight}
        clickShowLeft={clickShowLeft}
        clickShowCenter={clickShowCenter}
        labelLeft={leftLabel}
        labelCenter={centerLabel}
        showLeft={showLeft}
        showCenter={showCenter}
        onSearchChanged={null}
        placeHolderSearch="Search here"
        searchValue=""
      />
    );
    expect(
      wrapper.contains(
        <Button active={showLeft} onClick={clickShowLeft}>
          <FontAwesome name={'square-o'} /> {leftLabel}
        </Button>
      )
    ).toBe(true);
    expect(
      wrapper.contains(
        <Button active={showCenter} onClick={clickShowCenter}>
          <FontAwesome name={'check-square-o'} /> {centerLabel}
        </Button>
      )
    ).toBe(true);
    expect(wrapper.contains('Search here')).toBe(false); // placeholder, not a direct text
    expect(wrapper.find(MusitField).length).toBe(0);
  });
});
