/**
 * Created by steinaol on 5/27/16.
 */

import React, { Component } from 'react';
import { MusitDropDownField as MusitDropDown, MusitField } from '../../components/formfields'
import { Panel, Form, Grid, Row, Col, FormGroup } from 'react-bootstrap'
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
      controlId: 'type',
      labelText: 'Type',
      items: ['StorageUnit', 'Room', 'Building', 'Organization'],
      validate: 'text',
      tooltip: 'Type lagringsenhet',
      placeHolder: 'velg type here',
      valueText: () => this.props.unit.type,
      onChange: (storageType) => this.props.updateType(storageType)
    }
    this.name = {
      id: 'name',
      tooltip: this.props.translate('musit.storageUnits.name.tooltip'),
      validate: 'text',
      placeHolder: this.props.translate('musit.storageUnits.name.placeHolder'),
      value: this.props.unit.name,
      onChange: (storageUnitName) => this.props.updateName(storageUnitName)
    }
    this.onAddressChange = this.onAddressChange.bind(this)
    this.areaFrom = {
      id: 'areaFrom',
      tooltip: this.props.translate('musit.storageUnits.area.from.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.area.from.placeHolder'),
      value: this.props.unit.area,
      onChange: (areaFrom) => this.props.updateAreal1(areaFrom),
    }
    this.areaTo = {
      id: 'areaTo',
      tooltip: this.props.translate('musit.storageUnits.area.to.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.area.to.placeHolder'),
      value: this.props.unit.areaTo,
      onChange: (areaTo) => this.props.updateAreal2(areaTo),
    }
    this.heightFrom = {
      id: 'heightFrom',
      tooltip: this.props.translate('musit.storageUnits.height.from.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.height.from.placeHolder'),
      value: this.props.unit.height,
      onChange: (heightFrom) => this.props.updateHeight1(heightFrom),
    }
    this.heightTo = {
      id: 'heightTo',
      tooltip: this.props.translate('musit.storageUnits.height.to.tooltip'),
      validate: 'number',
      placeHolder: this.props.translate('musit.storageUnits.height.to.placeHolder'),
      value: this.props.unit.heightTo,
      onChange: (heightTo) => this.props.updateHeight2(heightTo),
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
        <label className="col-sm-3 control-label" htmlFor="comments2">{label}</label>
        <div class="col-sm-9" is="null">
          <MusitField {...fieldProps} />
        </div>
      </FormGroup>
    )
    const inputAddressProps = {
      id: 'addressField',
      placeholder: 'addresse',
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
      <Row>
        <Col md={3}>
          <label htmlFor={'addressField'}>Adresse</label>
        </Col>
        <Col md={9}>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsUpdateRequested={onAddressSuggestionsUpdateRequested}
            getSuggestionValue={this.getAddressSuggestionValue}
            renderSuggestion={this.renderAddressSuggestion}
            inputProps={inputAddressProps}
            shouldRenderSuggestions={(v) => v !== 'undefined'}
          />
        </Col>
      </Row>
    )

    return (
      <div>
        <main>
          <Panel>
            <Grid>
              <Row className="row-centered">
                <Col md={6}>
                  <form className="form-horizontal">
                    <form className="form-group">
                      <label className="col-sm-3 control-label" htmlFor="storageUnitType">
                        {this.type.labelText}</label>
                      <div class="col-sm-5" is="null">
                        <MusitDropDown
                          {...this.type}
                          id={this.type.controlId}
                          value={this.type.valueText()}
                          translate={this.props.translate}
                          translateKey={'musit.storageUnits.storageType.items.'}
                        />
                      </div>
                    </form>
                  </form>
                </Col>
                <Col md={6}>
                  <Form horizontal>
                    {renderFieldBlock(this.name, this.props.translate('musit.storageUnits.name.label'))}
                  </Form>
                </Col>
              </Row>
              <Row styleClass="row-centered">
                <Col md={6}>
                  <form className="form-horizontal">
                    <div className="form-group">
                      <label className="col-sm-3 control-label" htmlFor="comments2">
                        {this.props.translate('musit.storageUnits.area.from.label')}</label>
                      <div class="col-sm-5" is="null">
                        <MusitField
                          {...this.areaFrom}
                        />
                      </div>
                      <div class="col-sm-4" is="null">
                        <MusitField
                          {...this.areaTo}
                        />
                      </div>
                    </div>
                  </form>
                </Col>
                <Col md={6}>
                  <Form horizontal>
                    <div className="form-group">
                      <label className="col-sm-3 control-label" htmlFor="controlId">
                        {this.props.translate('musit.storageUnits.height.from.label')}</label>
                      <div class="col-sm-5" is="null">
                        <MusitField
                          {...this.heightFrom}
                        />
                      </div>
                      <div class="col-sm-4" is="null">
                        <MusitField
                          {...this.heightTo}
                        />
                      </div>
                    </div>
                  </Form>
                </Col>
              </Row >
              <Row>
                <Col md={6}>
                  {this.props.unit.type === 'building' ? addressBlock : null}
                </Col>
              </Row>
            </Grid>
          </Panel>
        </main>
      </div>
    );
  }
}
