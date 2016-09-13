import React, { Component, PropTypes } from 'react'
import { Table, FormGroup } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

export default class ObjectGrid extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    translate: PropTypes.func.isRequired,
    tableData: PropTypes.arrayOf(PropTypes.shape({
      museumsNumber: PropTypes.string.isRequired,
      uNumber: PropTypes.string.isRequired,
      term: PropTypes.string
    }))
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
                    <FontAwesome name="truck" />
                  </td>
                  <td id={`${id}_${c.identifier.museumNo}_${c.identifier.subNo}_shoppingCart`}>
                    <FontAwesome name="shopping-cart" />
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
