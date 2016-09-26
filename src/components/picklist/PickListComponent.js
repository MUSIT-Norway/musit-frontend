import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import ActionListPopupContainer from './ActionListPopupContainer'

export default class PickListComponent extends Component {
  static propTypes = {
    picks: React.PropTypes.array.isRequired,
    marked: React.PropTypes.array.isRequired,
    actions: React.PropTypes.array.isRequired,
    iconRendrer: React.PropTypes.func.isRequired,
    labelRendrer: React.PropTypes.func.isRequired,
    onToggleMarked: React.PropTypes.func.isRequired,
    showActionDialog: React.PropTypes.bool.isRequired,
    onCloseActionDialog: React.PropTypes.func.isRequired
  }

  render() {
    const style = require('./index.scss')
    const {
      picks,
      marked,
      iconRendrer,
      labelRendrer,
      onToggleMarked,
      actions,
      showActionDialog,
      onCloseActionDialog
    } = this.props

    return (
      <div>
        <ActionListPopupContainer show={showActionDialog} marked={marked} actions={actions} onClose={onCloseActionDialog} />
        <Table responsive striped condensed hover>
          <thead>
            <tr>
              <th style={{ verticalAlign: 'middle', textAlign: 'right' }} colSpan="3">
                Alle&nbsp;&nbsp;<input type="checkbox" />
                <FontAwesome className={style.normalAction} name="print" />
                <FontAwesome className={style.normalAction} name="truck" />
                <FontAwesome className={style.warningAction} name="remove" />
              </th>
            </tr>
          </thead>
          <tbody>
            {picks.map((pick) => {
              const checkSymbol = (marked.indexOf(pick.id) >= 0) ? 'check-square-o' : 'square-o'
              return (
                <tr key={pick.id}>
                  <td className={style.icon}>{iconRendrer(pick)}</td>
                  <td className={style.label}>{labelRendrer(pick)}</td>
                  <td style={{ verticalAlign: 'middle', textAlign: 'right' }}>
                    <input type="checkbox" onClick={(e) => onToggleMarked(e, pick.id)} className={style.normalAction} name={checkSymbol} />
                    <FontAwesome className={style.normalAction} name="print" />
                    <FontAwesome className={style.normalAction} name="truck" />
                    <FontAwesome className={style.warningAction} name="remove" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    )
  }

}
