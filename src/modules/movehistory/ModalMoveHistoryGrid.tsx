import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, FormGroup } from 'react-bootstrap';
import { parseISODate, DATE_FORMAT_DISPLAY } from '../../shared/util';
import { I18n } from 'react-i18nify';

export default class ModalMoveHistoryGrid extends Component {
  static propTypes = {
    tableData: PropTypes.arrayOf(PropTypes.object)
  };

  render() {
    const toPathStr = pathArr => pathArr.map(o => o.name).join('  /  ');
    return (
      <FormGroup>
        <div>
          <Table responsive hover condensed>
            <thead>
              <tr>
                <th>{I18n.t('musit.moveHistory.doneDate')}</th>
                <th>{I18n.t('musit.moveHistory.doneBy')}</th>
                <th>{I18n.t('musit.moveHistory.from')}</th>
                <th>{I18n.t('musit.moveHistory.to')}</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '12px', padding: '10px' }}>
              {[].concat(this.props.tableData).map((c, i) => (
                <tr key={i}>
                  <td>{` ${parseISODate(c.doneDate).format(DATE_FORMAT_DISPLAY)}`}</td>
                  <td>{` ${c.doneBy}`}</td>
                  <td>{` ${toPathStr(c.from.breadcrumb)}`}</td>
                  <td>{` ${toPathStr(c.to.breadcrumb)}`}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </FormGroup>
    );
  }
}
