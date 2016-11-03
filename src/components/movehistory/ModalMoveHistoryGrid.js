import React, { Component, PropTypes } from 'react';
import { Table, FormGroup } from 'react-bootstrap';
import { parseISODateNonStrict as parseISODate, DATE_FORMAT_DISPLAY } from '../../util';
import { I18n } from 'react-i18nify';

export default class ModalMoveHistoryGrid extends Component {
  static propTypes = {
    tableData: PropTypes.arrayOf(PropTypes.object)
  }

  render() {
    const toPathStr = (pathArr) => pathArr.map(o => o.name).join('  /  ');
    return (
      <FormGroup>
        <div>
          <Table responsive hover condensed>
            <thead>
              <tr>
                <th>
                  {I18n.t('musit.moveHistory.doneDate')}
                </th>
                <th>
                  {I18n.t('musit.moveHistory.doneBy')}
                </th>
                <th>
                  {I18n.t('musit.moveHistory.from')}
                </th>
                <th>
                  {I18n.t('musit.moveHistory.to')}
                </th>
              </tr>
            </thead>
            <tbody style={{ 'fontSize': '12px', padding: '10px' }}>
              {this.props.tableData.map((c, i) =>
                <tr key={i} id={`${i}`}>
                  <td id={`${i}_${c.doneDate}`}>
                    {` ${parseISODate(c.doneDate).format(DATE_FORMAT_DISPLAY)}`}
                  </td>
                  <td id={`${i}_${c.doneBy}`}>
                    {` ${c.doneBy}`}
                  </td>
                  <td id={`${i}_${c.from.path}`}>
                    {` ${toPathStr(c.from.breadcrumb)}`}
                  </td>
                  <td id={`${i}_${c.to.path}`}>
                    {` ${toPathStr(c.to.breadcrumb)}`}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </FormGroup>
    );
  }
}
