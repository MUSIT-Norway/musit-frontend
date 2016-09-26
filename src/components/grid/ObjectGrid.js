import React, { Component, PropTypes } from 'react'
import { Table, FormGroup } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

export default class ObjectGrid extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    translate: PropTypes.func.isRequired,
    tableData: PropTypes.arrayOf(PropTypes.shape({
      identifier: PropTypes.shape({
        museumNo: PropTypes.string.isRequired,
        subNo: PropTypes.string.isRequired,
      }).isRequired,
      displayName: PropTypes.string
    })).isRequired,
    onAction: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired
  }

  render() {
    const { id, translate, tableData } = this.props
    return (
      <FormGroup>
        <div>
          <Table responsive hover condensed>
            <thead>
              <tr>
                <th>
                  {translate('musit.grid.object.museumsNumber')}
                </th>
                <th>
                  {translate('musit.grid.object.uNumber')}
                </th>
                <th>
                  {translate('musit.grid.object.term')}
                </th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {tableData.map((c, i) =>
                <tr key={i} id={`${id}_${c.identifier.museumNo}_${c.identifier.subNo}`} >
                  <td id={`${id}_${c.identifier.museumNo}_${c.identifier.subNo}_museumNumber`}>
                    <FontAwesome name="rebel" />
                    {` ${c.identifier.museumNo}`}
                  </td>
                  <td id={`${id}_${c.identifier.museumNo}_${c.identifier.subNo}_uNumber`}>
                    {c.identifier.subNo}
                  </td>
                  <td id={`${id}_${c.identifier.museumNo}_${c.identifier.subNo}_term`}>
                    {c.displayName}
                  </td>
                  <td id={`${id}_${c.identifier.museumNo}_${c.identifier.subNo}_truck`}>
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault()
                        this.props.onMove(c)
                      }}
                    >
                      <FontAwesome name="truck" />
                    </a>
                  </td>
                  <td id={`${id}_${c.identifier.museumNo}_${c.identifier.subNo}_shoppingCart`}>
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault()
                        this.props.onAction('pickObject', c)
                      }}
                    >
                      <FontAwesome name="shopping-cart" />
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
