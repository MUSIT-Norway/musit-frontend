import React from 'react';
import Toolbar from '../Toolbar';
import { shallow } from 'enzyme';
import FontAwesome from 'react-fontawesome';
import { MusitField } from '../../formfields';
import { Button } from 'react-bootstrap';

describe('Toolbar', () => {

  const leftLabel = 'Left';
  const clickShowLeft = () => false;
  const rightLabel = 'Right';
  const clickShowRight = () => false;

  it('should create a toolbar with left toolbar item active', () => {
    const showLeft = true;
    const showRight = false;
    const wrapper = shallow(<Toolbar
      clickShowLeft={clickShowLeft}
      clickShowRight={clickShowRight}
      labelLeft={leftLabel}
      labelRight={rightLabel}
      showLeft={showLeft}
      showRight={showRight}
      onSearchChanged={() => false}
      placeHolderSearch="Search here"
      searchValue=""
    />);
    expect(wrapper.contains(
      <Button active={showLeft} onClick={clickShowLeft}>
        <FontAwesome name={'check-square-o'} />
        {' '}
        {leftLabel}
      </Button>
    )).toBe(true);
    expect(wrapper.contains(
      <Button active={showRight} onClick={clickShowRight}>
        <FontAwesome name={'square-o'} />
        {' '}
        {rightLabel}
      </Button>
    )).toBe(true);
    expect(wrapper.contains('Search here')).toBe(false); // placeholder, not a direct text
    expect(wrapper.find(MusitField).length).toBe(1);
  });

  it('should create a toolbar with right toolbar item active', () => {
    const showLeft = false;
    const showRight = true;
    const wrapper = shallow(<Toolbar
      clickShowLeft={clickShowLeft}
      clickShowRight={clickShowRight}
      labelLeft={leftLabel}
      labelRight={rightLabel}
      showLeft={showLeft}
      showRight={showRight}
      onSearchChanged={() => false}
      placeHolderSearch="Search here"
      searchValue=""
    />);
    expect(wrapper.contains(
      <Button active={showLeft} onClick={clickShowLeft}>
        <FontAwesome name={'square-o'} />
        {' '}
        {leftLabel}
      </Button>
    )).toBe(true);
    expect(wrapper.contains(
      <Button active={showRight} onClick={clickShowRight}>
        <FontAwesome name={'check-square-o'} />
        {' '}
        {rightLabel}
      </Button>
    )).toBe(true);
    expect(wrapper.contains('Search here')).toBe(false); // placeholder, not a direct text
    expect(wrapper.find(MusitField).length).toBe(1);
  });

  it('should create a toolbar without search bar if onSearchChanged is not provided', () => {
    const showLeft = false;
    const showRight = true;
    const wrapper = shallow(<Toolbar
      clickShowLeft={clickShowLeft}
      clickShowRight={clickShowRight}
      labelLeft={leftLabel}
      labelRight={rightLabel}
      showLeft={showLeft}
      showRight={showRight}
      onSearchChanged={null}
      placeHolderSearch="Search here"
      searchValue=""
    />);
    expect(wrapper.contains(
      <Button active={showLeft} onClick={clickShowLeft}>
        <FontAwesome name={'square-o'} />
        {' '}
        {leftLabel}
      </Button>
    )).toBe(true);
    expect(wrapper.contains(
      <Button active={showRight} onClick={clickShowRight}>
        <FontAwesome name={'check-square-o'} />
        {' '}
        {rightLabel}
      </Button>
    )).toBe(true);
    expect(wrapper.contains('Search here')).toBe(false); // placeholder, not a direct text
    expect(wrapper.find(MusitField).length).toBe(0);
  });
});
