import * as React from 'react';
import { Component } from 'react';
import { ControlLabel, Button } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import { I18n } from 'react-i18nify';
import { AppSession } from '../../types/appSession';


interface NodeLeftMenuComponentProps {
  showNewNode?: boolean;
  onClickNewNode: Function;
  stats?: {
    numNodes: number;
    numObjects: number;
    totalObjects: number;
  };
  onClickProperties: Function;
  onClickControlObservations: Function;
  onClickMoveNode: Function;
  onClickDelete: Function;
  showButtons?: boolean;
  appSession: AppSession;
}
/* Old:
  static propTypes = {
    showNewNode: PropTypes.bool,
    onClickNewNode: PropTypes.func.isRequired,
    stats: PropTypes.shape({
      numNodes: PropTypes.number,
      numObjects: PropTypes.number,
      totalObjects: PropTypes.number
    }),
    onClickProperties: PropTypes.func.isRequired,
    onClickControlObservations: PropTypes.func.isRequired,
    onClickMoveNode: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired,
    showButtons: PropTypes.bool,
    appSession: AppSession
  };

*/

export default class NodeLeftMenuComponent extends Component<NodeLeftMenuComponentProps> {
  render() {
    const {
      showNewNode,
      onClickNewNode,
      onClickProperties,
      onClickControlObservations,
      onClickMoveNode,
      onClickDelete,
      showButtons
    } = this.props;

    const buttonLink = (
      type: string,
      icon: string,
      eventType: Function,
      disabled: boolean,
      useMusitIcon: boolean = false
    ) => (
      <div style={{ border: 'none', textAlign: 'center' }}>
        <Button
          bsStyle="link"
          onClick={() => eventType()}
          style={{ color: 'black' }}
          disabled={disabled}
        >
          {useMusitIcon ? (
            <span className={`icon icon-${icon}`} style={{ padding: '2px' }} />
          ) : (
            <FontAwesome name={`${icon}`} style={{ fontSize: '1.5em', padding: '2px' }} />
          )}
          <br />
          {I18n.t(`musit.leftMenu.node.${type}`)}
        </Button>
      </div>
    );

    const showCount = (type: string) => {
      const count = this.props.stats && this.props.stats[type];
      return (
        <div style={{ border: 'none', textAlign: 'center' }}>
          {I18n.t(`musit.leftMenu.node.${type}`)}
          <br />
          <ControlLabel>
            {count === null ? <FontAwesome name="spinner" spin /> : count}
          </ControlLabel>
        </div>
      );
    };

    const newButton = () => (
      <div style={{ border: 'none', textAlign: 'center' }}>
        <Button onClick={() => onClickNewNode()} style={{ textAlign: 'left' }}>
          <FontAwesome name="plus-circle" style={{ padding: '2px' }} />
          {I18n.t('musit.leftMenu.node.newNode')}
        </Button>
      </div>
    );
    const storageFacilityAdmin = this.props.appSession.rolesForModules
      .storageFacilityAdmin;

    return (
      <div>
        {showNewNode && storageFacilityAdmin && newButton()}
        {showButtons && <hr />}
        {showButtons && showCount('numNodes')}
        {showButtons && showCount('numObjects')}
        {showButtons && showCount('totalObjects')}
        {showButtons && showCount('numSamples')}
        {showButtons && showCount('totalSamples')}
        {showButtons && <hr />}
        {showButtons &&
          buttonLink('properties', 'cog', onClickProperties, !storageFacilityAdmin)}
        {showButtons &&
          buttonLink(
            'controlsobservations',
            'musitcontrolobsicon',
            onClickControlObservations,
            !this.props.appSession.rolesForModules.storageFacilityWrite,
            true
          )}
        {showButtons &&
          buttonLink('moveNode', 'truck', onClickMoveNode, !storageFacilityAdmin)}
        {showButtons &&
          buttonLink(
            'delete',
            'trash-o',
            onClickDelete,
            this.isDeleteDisabled() || !storageFacilityAdmin
          )}
      </div>
    );
  }

  isDeleteDisabled() {
    if (!this.props.stats) {
      return true;
    }
    const objectsOnNode = this.props.stats.numNodes;
    const underNodeCount = this.props.stats.numObjects;
    return objectsOnNode + underNodeCount > 0;
  }
}
