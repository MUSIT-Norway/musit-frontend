import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import ActionListPopupContainer from './ActionListPopupContainer'

export default class PickListComponent extends Component {
  static propTypes = {
    picks: React.PropTypes.array.isRequired,
    onMove: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired,
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
              <th className={style.toolsColumn} colSpan="3">
                Alle&nbsp;&nbsp;<input type="checkbox" onChange={(e) => this.props.onToggleMarked(e, null)} />
                <FontAwesome className={style.normalAction} name="print" />
                <FontAwesome className={style.normalAction} style={{ cursor: 'pointer' }} name="truck" onClick={() => this.props.onMove(marked)} />
                <FontAwesome className={style.warningAction} style={{ cursor: 'pointer' }} name="remove" onClick={() => this.props.onRemove(marked)} />
              </th>
            </tr>
          </thead>
          <tbody>
            {picks.map((pick) => {
              return (
                <tr key={pick.id}>
                  <td className={style.icon}>{iconRendrer(pick)}</td>
                  <td className={style.label}>{labelRendrer(pick)}</td>
                  <td className={style.toolsColumn}>
                    <input type="checkbox" checked={marked.find(m => m.id === pick.id && m.pickType === pick.pickType) ? 'checked' : ''} onClick={(e) => onToggleMarked(e, pick.id)} className={style.normalAction} />
                    <FontAwesome className={style.normalAction} name="print" />
                    <FontAwesome className={style.normalAction} style={{ cursor: 'pointer' }} name="truck" onClick={() => this.props.onMove(pick)} />
                    <FontAwesome className={style.warningAction} style={{ cursor: 'pointer' }} name="remove" onClick={() => this.props.onRemove(pick)} />
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
