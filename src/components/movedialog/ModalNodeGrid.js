import React, { Component, PropTypes } from 'react'
import { Table, FormGroup } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import './ModalNodeGrid.css'

export default class ModalNodeGrid extends Component {
  static propTypes = {
    tableData: PropTypes.arrayOf(PropTypes.object),
    onClick: PropTypes.func.isRequired
  }

  render() {
    return (
      <FormGroup>
        <div>
          <Table responsive hover className="modalNodeGrid">
            <tbody>
              {this.props.tableData.map((c, i) =>
                <tr key={i} id={`${i}`}>
                  <td id={`${i}_${c.name}`}>
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault()
                        this.props.onClick(c)
                      }}
                    >
                      <FontAwesome name="folder" />
                      {` ${c.name}`}
                    </a>
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
