/**
 * Created by steinaol on 5/27/16.
 */

import React, { Component } from 'react';
import { MusitDropDownField, MusitField } from '../../components/formfields'
import { Form, Grid, Row, Col, FormGroup } from 'react-bootstrap'
import Autosuggest from 'react-autosuggest'

export default class StorageUnitComponent extends Component {

  static propTypes = {
    unit: React.PropTypes.shape({
      name: React.PropTypes.string,
      area: React.PropTypes.string,
      areaTo: React.PropTypes.number,
      height: React.PropTypes.number,
      heightTo: React.PropTypes.number,
      type: React.PropTypes.string,
      address: React.PropTypes.string }
    ),
    updateType: React.PropTypes.func.isRequired,
    updateName: React.PropTypes.func.isRequired,
    updateHeight1: React.PropTypes.func.isRequired,
    updateHeight2: React.PropTypes.func.isRequired,
    updateAreal1: React.PropTypes.func.isRequired,
    updateAreal2: React.PropTypes.func.isRequired,
    updateAddress: React.PropTypes.func.isRequired,
    suggest: React.PropTypes.array.isRequired,
    onAddressSuggestionsUpdateRequested: React.PropTypes.func.isRequired,
    translate: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.type = {
      id: 'type',
      validate: 'text',
      tooltip: this.props.translate('musit.storageUnits.type.tooltip'),
      placeHolder: this.props.translate('musit.storageUnits.type.placeHolder'),
      maximumLength: 100,
      value: () => this.props.unit.type
    }
    this.name = {
      id: 'name',
      tooltip: this.props.translate('musit.storageUnits.name.tooltip'),
      validate: 'text',
      placeHolder: this.props.translate('musit.storageUnits.name.placeHolder'),
      value: this.props.unit.name,
      onChange: (storageUnitName) => this.props.updateName(storageUnitName),
      maximumLength: 100
    }
    this.onAddressChange = this.onAddressChange.bind(this)
    this.areaFrom = {
      id: 'areaFrom',
      tooltip: this.props.translate('musit.storageUnits.area.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.area.placeHolder'),
      onChange: (areaFrom) => this.props.updateAreal1(areaFrom),
      precision: 3
    }
    this.areaTo = {
      id: 'areaTo',
      tooltip: this.props.translate('musit.storageUnits.areaTo.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.areaTo.placeHolder'),
      onChange: (areaTo) => this.props.updateAreal2(areaTo),
      precision: 3
    }
    this.heightFrom = {
      id: 'heightFrom',
      tooltip: this.props.translate('musit.storageUnits.height.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.height.placeHolder'),
      onChange: (heightFrom) => this.props.updateHeight1(heightFrom),
      precision: 3
    }
    this.heightTo = {
      id: 'heightTo',
      tooltip: this.props.translate('musit.storageUnits.heightTo.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.heightTo.placeHolder'),
      onChange: (heightTo) => this.props.updateHeight2(heightTo),
      precision: 3
    }
  }

  onAddressChange(event, { newValue }) {
    this.props.updateAddress(newValue)
  }

  getAddressSuggestionValue(suggestion) {
    return `${suggestion.street} ${suggestion.streetNo}, ${suggestion.zip} ${suggestion.place}`
  }

  renderAddressSuggestion(suggestion) {
    const suggestionText = `${suggestion.street} ${suggestion.streetNo}, ${suggestion.zip} ${suggestion.place}`
    return (
      <span className={'suggestion-content'}>{suggestionText}</span>
    )
  }

  render() {
    const renderFieldBlock = (fieldProps, label) => (
      <FormGroup>
        <label className="col-sm-3 control-label" htmlFor="name">
          {label}{ <span style={{ color: 'red' }}>*</span> }
        </label>
        <div class="col-sm-8" is="null">
          <MusitField {...fieldProps} value={this.props.unit.name} />
        </div>
      </FormGroup>
    )
    const inputAddressProps = {
      id: 'addressField',
      placeholder: this.props.translate('musit.storageUnits.address.placeHolder'),
      value: this.props.unit.address,
      type: 'search',
      onChange: this.onAddressChange
    }
    const {
      onAddressSuggestionsUpdateRequested,
      suggest } = this.props
    const { addressField } = suggest;

    const suggestions = addressField && addressField.data ? addressField.data : [];

    const addressBlock = (
      <FormGroup>
        <label className="col-sm-3 control-label" htmlFor="address">
          {this.props.translate('musit.storageUnits.address.labelText')}
        </label>
        <div class="col-sm-8" is="null">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsUpdateRequested={onAddressSuggestionsUpdateRequested}
            getSuggestionValue={this.getAddressSuggestionValue}
            renderSuggestion={this.renderAddressSuggestion}
            inputProps={inputAddressProps}
            shouldRenderSuggestions={(v) => v !== 'undefined'}
          />
        </div>
      </FormGroup>
    )

    return (
      <div>
        <Grid>
          <Row className="row-centered">
            <Col md={5}>
              <form className="form-horizontal">
                <form className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="storageUnitType">
                    {this.props.translate('musit.storageUnits.type.labelText')}
                    { <span style={{ color: 'red' }}>*</span> }
                  </label>
                  <div class="col-sm-4" is="null">
                    <MusitDropDownField
                      {...this.type}
                      items={['StorageUnit', 'Room', 'Building', 'Organisation']}
                      translate={this.props.translate}
                      translateKeyPrefix={'musit.storageUnits.type.items.'}
                      onChange={(storageType) => this.props.updateType(storageType)}
                      value={this.type.value()}
                    />
                  </div>
                </form>
              </form>
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              <Form horizontal>
                {renderFieldBlock(this.name, this.props.translate('musit.storageUnits.name.labelText'))}
              </Form>
            </Col>
            <Col md={5}>
              <Form horizontal>
                {this.props.unit.type === 'Building' || this.props.unit.type === 'Organisation' ? addressBlock : null}
              </Form>
            </Col>
          </Row>
          <Row styleClass="row-centered">
            <Col md={5}>
              <form className="form-horizontal">
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="comments2">
                    {this.props.translate('musit.storageUnits.area.labelText')}</label>
                  <div class="col-sm-4" is="null">
                    <MusitField
                      {...this.areaFrom}
                      value={this.props.unit.area}
                    />
                  </div>
                  <div class="col-sm-4" is="null">
                    <MusitField
                      {...this.areaTo}
                      value={this.props.unit.areaTo}
                    />
                  </div>
                </div>
              </form>
            </Col>
            <Col md={5}>
              <Form horizontal>
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor="controlId">
                    {this.props.translate('musit.storageUnits.height.labelText')}</label>
                  <div class="col-sm-4" is="null">
                    <MusitField
                      {...this.heightFrom}
                      value={this.props.unit.height}
                    />
                  </div>
                  <div class="col-sm-4" is="null">
                    <MusitField
                      {...this.heightTo}
                      value={this.props.unit.heightTo}
                    />
                  </div>
                </div>
              </Form>
            </Col>
          </Row >
        </Grid>
      </div>
    );
  }
}
