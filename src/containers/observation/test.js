import React, { Component } from 'react';
import { Button, Panel, Grid } from 'react-bootstrap'
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { MusitField, MusitDropDownField } from '../../components/formfields'

const actions = {
  submitFormAction: (values) => {
    return {
      type: 'wakka',
      data: values
    }
  }
};

const validate = (formProps) => {
  const errors = {};

  if (!formProps.firstName) {
    errors.firstName = 'Please enter a first name';
  }

  if (!formProps.lastName) {
    errors.lastName = 'Please enter a last name';
  }

  if (!formProps.email || formProps.email.indexOf('@') === -1) {
    errors.email = 'Please enter an email';
  }

  if (!formProps.phoneNumber) {
    errors.phoneNumber = 'Please enter a phone number'
  }

  return errors;
};


const form = reduxForm({
  form: 'ReduxFormTutorial',
  validate
});

class ReduxFormTutorial extends Component {
  static propTypes = {
    pristine: React.PropTypes.bool,
    submitting: React.PropTypes.bool,
    reset: React.PropTypes.func.isRequired,
    submitFormAction: React.PropTypes.func.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    initialize: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  componentDidMount() {
    this.handleInitialize();
  }

  handleInitialize() {
    const initData = {
      firstName: '',
      lastName: '',
      sex: '',
      email: '',
      phoneNumber: ''
    };

    this.props.initialize(initData);
  }

  handleFormSubmit(formProps) {
    this.props.submitFormAction(formProps);
  }

  isInvalid(props) {
    return props.meta.touched && props.meta.error
  }

  renderField = props => <MusitField {...props.input} validator={() => this.isInvalid(props)} />

  renderDropdownField = items => props => <MusitDropDownField
    {...props.input}
    validator={() => this.isInvalid(props)}
    items={items}
  />

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div>
        <main>
          <Panel>
            <Grid>
              <form onSubmit={handleSubmit(this.handleFormSubmit)}>

                <label>First Name:</label>
                <Field name="firstName" type="text" component={this.renderField} />

                <label>Last Name:</label>
                <Field name="lastName" type="text" component={this.renderField} />

                <label>Gender:</label>
                <Field name="sex" component={this.renderDropdownField(['Male', 'Female'])} />

                <label>Email:</label>
                <Field name="email" type="email" component={this.renderField} />

                <label>Phone:</label>
                <Field name="phoneNumber" type="tel" component={this.renderField} />

                <Button type="submit" disabled={pristine || submitting}>Submit</Button>
                <Button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</Button>
              </form>
            </Grid>
          </Panel>
        </main>
      </div>
    )
  }
}

export default connect(state => state.form.ReduxFormTutorial, actions)(form(ReduxFormTutorial));
