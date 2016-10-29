import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json';
import React from 'react'
import ControlAddContainer from '../index'

function wrapWithContext(context, contextTypes, child){

  class WrapperWithContext extends React.Component {
    static childContextTypes = contextTypes;
    getChildContext() { return context; }
    render() {
      return child
    }
  }

  return <WrapperWithContext />;
}

describe('Render add control page', () => {
  it('should set default date and have correct date format', () => {
    const container = <ControlAddContainer
      doneDate={new Date(2016, 10, 10, 22).toISOString()}
      translate={(key) => key}
      params={{ }}
      saveControl={() => true}
      loadStorageObj={() => true}
      rootNode={{
        path: ',1,'
      }}
    />;
    const context = { closeModal: () => true };
    const contextTypes = { closeModal: React.PropTypes.func };
    const wrapper = shallow(
      wrapWithContext(context, contextTypes, container)
    )
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})
