
import React, { Component, PropTypes } from 'react'
import { Table, FormGroup } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import { I18n } from 'react-i18nify'

export default class ObjectGrid extends Component {
  static propTypes = {
    id: PropTypes.number,
    translate: PropTypes.func.isRequired,
    tableData: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      museumNo: PropTypes.string.isRequired,
      subNo: PropTypes.string,
      term: PropTypes.string.isRequired
    })).isRequired,
    onAction: PropTypes.func.isRequired,
    showMoveHistory: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired,
    rootNode: React.PropTypes.object
  }

  render() {
    const { id, translate, tableData } = this.props
    return (
      <div>
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
                  <tr key={i} id={`${id}_${c.museumNo}_${c.subNo}`} >
                    <td id={`${id}_${c.museumNo}_${c.subNo}_museumNumber`}>
                      <FontAwesome name="rebel" />
                      {` ${c.museumNo}`}
                    </td>
                    <td id={`${id}_${c.museumNo}_${c.subNo}_uNumber`}>
                      {c.subNo}
                    </td>
                    <td id={`${id}_${c.museumNo}_${c.subNo}_term`}>
                      {c.term}
                    </td>
                    <td id={`${id}_${c.museumNo}_${c.subNo}_moveHistory`}>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault()
                          this.props.showMoveHistory(c.id)
                        }}
                        title={I18n.t('musit.grid.object.iconTooltip.moveObjectHistory')}
                      >
                        <span className="icon icon-musitmovehistoryicon" />
                      </a>
                    </td>
                    <td id={`${id}_${c.museumNo}_${c.subNo}_truck`}>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault()
                          this.props.onMove(c)
                        }}
                        title={I18n.t('musit.grid.object.iconTooltip.moveObject')}
                      >
                        <FontAwesome style={{ fontSize: '1.5em' }} name="truck" />
                      </a>
                    </td>
                    <td id={`${id}_${c.museumNo}_${c.subNo}_shoppingCart`}>
                      <a
                        href=""
                        onClick={(e) => {
                          e.preventDefault()
                          this.props.onAction('pickObject', c)
                        }}
                        title={I18n.t('musit.grid.object.iconTooltip.addToPickList')}
                      >
                        <FontAwesome style={{ fontSize: '1.5em' }} name="shopping-cart" />
                      </a>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </FormGroup>
      </div>
    )
  }
}
