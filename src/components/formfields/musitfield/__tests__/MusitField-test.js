import { assert, React, ReactDOM, ReactTestUtils } from '../../../../../test/setup';
import MusitField from '../index';

describe('MusitField', () => {
  it('should render MusitField 1', () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <MusitField
        id="navn"
        placeHolder="skriv inn navn her"
        value="test value"
        validate="text"
        onChange={() => null}
      />
    );

    const inputField = ReactDOM.findDOMNode(myDiv);
    const field = inputField.querySelectorAll('input')[0];
    assert.equal(field.value, 'test value', 'Field must be present')
  });

  it('should render MusitField 2', () => {
    const myDiv = ReactTestUtils.renderIntoDocument(
      <MusitField
        id="navn"
        placeHolder="skriv inn navn her"
        help="Help text"
        value="just test value"
        validate="text"
        onChange={() => null}
      />
    );

    const actualDiv = ReactDOM.findDOMNode(myDiv);
    const field = actualDiv.querySelectorAll('input')[0];
    assert.equal(field.value, 'just test value', 'Field must be present');
  });
});
