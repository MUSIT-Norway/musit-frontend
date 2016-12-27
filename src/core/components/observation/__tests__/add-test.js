import assert from 'assert';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import ObservationPage from '../index';
import moment from 'moment';
import { DATE_FORMAT_DISPLAY } from '../../../../util';

describe('Render add observation page', () => {
  const renderer = ReactTestUtils.createRenderer();
  let observationPage;

  beforeEach(() => {
    renderer.render(
      <ObservationPage
        translate={(key) => key}
        params={{ }}
        onSaveObservation={() => true}
        mode="ADD"
        id="1"
      />
    );
    observationPage = renderer.getRenderOutput();
  });

  it('should set default date and have correct date format', () => {
    const date = observationPage
            .props
            .children
            .props
            .children[0]
            .props
            .children[1]
            .props
            .children[0]
            .props
            .children[1];
    assert(date.props.dateFormat === DATE_FORMAT_DISPLAY);
    assert(moment(date.props.value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid());
  });
});
