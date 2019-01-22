// @flow
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Pagination from '../pagination';

import type { Paging } from '../../searchStore';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Pagination', () => {
  describe('render', () => {
    it('should render all pages including next and previous', () => {
      const onChangePage = sinon.spy();
      const paging: Paging = {
        currentPage: 1,
        showPages: [1, 2, 3],
        totalPages: 3
      };

      const Comp = shallow(<Pagination paging={paging} onChangePage={onChangePage} />);
      const res = Comp.find('.pagination > li');

      expect(res).toHaveLength(5);
    });

    it('should render current page as active', () => {
      const onChangePage = sinon.spy();
      const paging: Paging = {
        currentPage: 1,
        showPages: [1, 2, 3],
        totalPages: 3
      };

      const Comp = shallow(<Pagination paging={paging} onChangePage={onChangePage} />);
      const res = Comp.find('.pagination > .active');

      expect(res.text()).toEqual('1');
    });

    it('previous page should be disabled when current page is first page', () => {
      const onChangePage = sinon.spy();
      const paging: Paging = {
        currentPage: 1,
        showPages: [1, 2, 3],
        totalPages: 3
      };

      const Comp = shallow(<Pagination paging={paging} onChangePage={onChangePage} />);
      const res = Comp.find('.pagination > li');

      expect(res.first().hasClass('disabled')).toEqual(true);
      expect(res.last().hasClass('disabled')).toEqual(false);
    });

    it('next page should be disabled when current page is last page', () => {
      const onChangePage = sinon.spy();
      const paging: Paging = {
        currentPage: 3,
        showPages: [1, 2, 3],
        totalPages: 3
      };

      const Comp = shallow(<Pagination paging={paging} onChangePage={onChangePage} />);
      const res = Comp.find('.pagination > li');

      expect(res.first().hasClass('disabled')).toEqual(false);
      expect(res.last().hasClass('disabled')).toEqual(true);
    });
  });

  describe('click', () => {
    const selector = '.pagination > li > span';

    describe('previous', () => {
      it('not trigger click event on previous when on first page', () => {
        const onChangePage = sinon.spy();
        const paging: Paging = {
          currentPage: 1,
          showPages: [1, 2, 3],
          totalPages: 3
        };

        const Comp = shallow(<Pagination paging={paging} onChangePage={onChangePage} />);
        const res = Comp.find(selector);

        res.first().simulate('click', {});
        expect(onChangePage.callCount).toEqual(0);
      });

      it('trigger click event on previous when not on first page', () => {
        const onChangePage = sinon.spy();
        const paging: Paging = {
          currentPage: 2,
          showPages: [1, 2, 3],
          totalPages: 3
        };

        const Comp = shallow(<Pagination paging={paging} onChangePage={onChangePage} />);
        const res = Comp.find(selector);

        res.first().simulate('click', {});

        expect(onChangePage.callCount).toEqual(1);
        expect(onChangePage.getCall(0).args[0]).toEqual('previous');
      });
    });

    describe('on page', () => {
      it('not trigger click event on active page', () => {
        const onChangePage = sinon.spy();
        const paging: Paging = {
          currentPage: 1,
          showPages: [1, 2, 3],
          totalPages: 3
        };

        const Comp = shallow(<Pagination paging={paging} onChangePage={onChangePage} />);
        const res = Comp.find(selector);

        res.at(1).simulate('click', {});
        expect(onChangePage.callCount).toEqual(0);
      });

      it('trigger click event non active page', () => {
        const onChangePage = sinon.spy();
        const paging: Paging = {
          currentPage: 1,
          showPages: [1, 2, 3],
          totalPages: 3
        };

        const Comp = shallow(<Pagination paging={paging} onChangePage={onChangePage} />);
        const res = Comp.find(selector);
        res.at(2).simulate('click', {});

        expect(onChangePage.callCount).toEqual(1);
        expect(onChangePage.getCall(0).args[0]).toEqual(2);
      });
    });

    describe('next', () => {
      it('not trigger click event on next when on last page', () => {
        const onChangePage = sinon.spy();
        const paging: Paging = {
          currentPage: 3,
          showPages: [1, 2, 3],
          totalPages: 3
        };

        const Comp = shallow(<Pagination paging={paging} onChangePage={onChangePage} />);
        const res = Comp.find(selector);

        res.last().simulate('click', {});
        expect(onChangePage.callCount).toEqual(0);
      });

      it('trigger click event on next when not on last page', () => {
        const onChangePage = sinon.spy();
        const paging: Paging = {
          currentPage: 2,
          showPages: [1, 2, 3],
          totalPages: 3
        };

        const Comp = shallow(<Pagination paging={paging} onChangePage={onChangePage} />);
        const res = Comp.find(selector);

        res.last().simulate('click', {});
        expect(onChangePage.callCount).toEqual(1);
        expect(onChangePage.getCall(0).args[0]).toEqual('next');
      });
    });
  });
});
