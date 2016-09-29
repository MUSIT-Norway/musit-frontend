

import React, { Component, PropTypes } from 'react'
import { Table, FormGroup } from 'react-bootstrap'

export default class ModalMoveHistoryGrid extends Component {
  static propTypes = {
    tableData: PropTypes.arrayOf(PropTypes.object)
  }

  render() {
    return (
      <FormGroup>
        <div>
          <Table responsive hover condensed>
            <thead>
              <tr>
                <th>
                  Done date
                </th>
                <th>
                  Done by
                </th>
                <th>
                  From
                </th>
                <th>
                  To
                </th>
              </tr>
            </thead>
            <tbody style={{ 'font-size': '12px', padding: '10px' }}>
              {this.props.tableData.map((c, i) =>
                <tr key={i} id={`${i}`}>
                  <td id={`${i}_${c.doneDate}`}>
                    {` ${c.doneDate}`}
                  </td>
                  <td id={`${i}_${c.doneBy}`}>
                    {` ${c.doneBy}`}
                  </td>
                  <td id={`${i}_${c.from.path}`}>
                    {` ${c.from.path}`}
                  </td>
                  <td id={`${i}_${c.to.path}`}>
                    {` ${c.to.path}`}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </FormGroup>
    )
  }
}
