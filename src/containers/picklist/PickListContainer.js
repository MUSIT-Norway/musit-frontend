
import React from 'react'
import { PickListComponent } from '../../components/picklist'
import { PageHeader, Grid } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import Breadcrumb from '../../layout/Breadcrumb'
import { hashHistory } from 'react-router'
import { TYPES } from '../../reducers/picklist'
import { I18n } from 'react-i18nify'
import MusitModal from '../../components/formfields/musitModal'
import './PickListContainer.css'

export default class PickListContainer extends React.Component {
  static propTypes = {
    picks: React.PropTypes.object.isRequired,
    toggleNode: React.PropTypes.func.isRequired,
    toggleObject: React.PropTypes.func.isRequired,
    removeNode: React.PropTypes.func.isRequired,
    removeObject: React.PropTypes.func.isRequired,
    moveNode: React.PropTypes.func.isRequired,
    moveObject: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
    user: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired
    }),
    addNode: React.PropTypes.func.isRequired,
    addObject: React.PropTypes.func.isRequired,
    loadRoot: React.PropTypes.func.isRequired,
    rootNode: React.PropTypes.object,
    refreshNodes: React.PropTypes.func.isRequired,
    refreshObjects: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      showModal: false
    }
  }

  isTypeNode() {
    const type = this.props.params.type.toUpperCase();
    return type === TYPES.NODE
  }
  showModal = (items) => {
    this.setState({ ...this.state, showModal: true, itemsToMove: [].concat(items) })
  }

  hideModal = () => {
    this.setState({ ...this.state, showModal: false, itemsToMove: [] })
  }

  nodeCallback = (toName, toMoveLenght, name) => ({
    onSuccess: () => {
      this.props.refreshNodes(this.state.itemsToMove.map(item => item.id))
      this.hideModal()
      if (toMoveLenght === 1) {
        window.alert(I18n.t('musit.moveModal.messages.nodeMoved', { name, destination: toName }))
      } else {
        window.alert(I18n.t('musit.moveModal.messages.nodesMoved', { count: toMoveLenght, destination: toName }))
      }
    },
    onFailure: () => {
      if (toMoveLenght === 1) {
        window.alert(I18n.t('musit.moveModal.messages.errorNode', { name, destination: toName }))
      } else {
        window.alert(I18n.t('musit.moveModal.messages.errorNodes', { count: toMoveLenght, destination: toName }))
      }
    }
  })
  objectCallback = (toName, toMoveLenght, name) => ({
    onSuccess: () => {
      this.props.refreshObjects(this.state.itemsToMove.map(item => item.id))
      this.hideModal()
      if (toMoveLenght === 1) {
        window.alert(I18n.t('musit.moveModal.messages.objectMoved', { name, destination: toName }))
      } else {
        window.alert(I18n.t('musit.moveModal.messages.objectsMoved', { count: toMoveLenght, destination: toName }))
      }
    },
    onFailure: () => {
      if (toMoveLenght === 1) {
        window.alert(I18n.t('musit.moveModal.messages.errorObject', { name, destination: toName }))
      } else {
        window.alert(I18n.t('musit.moveModal.messages.errorObjects', { count: toMoveLenght, destination: toName }))
      }
    }
  })

  moveModal = (toId, toName) => {
    const moveFunction = this.isTypeNode() ? this.props.moveNode : this.props.moveObject
    const toMove = this.state.itemsToMove.map(itemToMove => itemToMove.id)
    const toMoveLenght = toMove.length
    const name = this.isTypeNode() ? this.state.itemsToMove[0].name : this.state.itemsToMove[0].displayName
    const callback = this.isTypeNode() ?
    this.nodeCallback(toName, toMoveLenght, name) : this.objectCallback(toName, toMoveLenght, name)
    moveFunction(toMove, toId, this.props.user.id, callback)
  }

  render() {
    const { toggleNode, toggleObject, removeNode, removeObject } = this.props
    const type = this.props.params.type.toUpperCase();
    const picks = this.props.picks[type]
    const marked = picks.filter(p => p.marked).map(p => p.value)
    return (
      <div>
        <MusitModal
          show={this.state.showModal}
          onHide={this.hideModal}
          onMove={this.moveModal}
          headerText={this.isTypeNode() ? I18n.t('musit.moveModal.moveNodes') : I18n.t('musit.moveModal.moveObjects')}
        />
        <main>
          <Grid>
            <PageHeader>
              {I18n.t(`musit.pickList.title.${this.props.params.type}`)}
            </PageHeader>
            <PickListComponent
              picks={picks}
              marked={marked}
              isnode={this.isTypeNode()}
              iconRendrer={(pick) => <FontAwesome
                name={pick.value.name ? 'folder' : 'rebel'}
                style={{ fontSize: '1.5em' }}
              />}
              labelRendrer={(pick) => {
                return (
                  <div>
                    {!this.isTypeNode() ? <span style={{ paddingLeft: '1em' }}>{pick.value.museumNo}</span> : null}
                    {!this.isTypeNode() ? <span style={{ paddingLeft: '1em' }}>{pick.value.subNo}</span> : null}
                    <span style={{ paddingLeft: '1em' }}>{pick.value.name ? pick.value.name : pick.value.term}</span>
                    <div className="labelText">
                      <Breadcrumb
                        nodes={pick.path}
                        onClickCrumb={node => hashHistory.push(`/magasin/${node.id === -1 ? 'root' : node.id}`)}
                        allActive
                      />
                    </div>
                  </div>
                )
              }}
              toggle={(item, on) => this.isTypeNode() ? toggleNode(item, on) : toggleObject(item, on)}
              remove={item => this.isTypeNode() ? removeNode(item) : removeObject(item)}
              move={this.showModal}
            />
            <div style={{ textAlign: 'right' }}>
              {marked.length}/{picks.length} &nbsp;
              {this.isTypeNode() ? I18n.t('musit.pickList.footer.nodeSelected')
                : I18n.t('musit.pickList.footer.objectSelected') }
            </div>
          </Grid>
        </main>
      </div>
    )
  }
}
