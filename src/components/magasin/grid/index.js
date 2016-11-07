
import React from 'react';
import { hashHistory } from 'react-router';
import NodeGrid from './NodeGrid';
import ObjectGrid from './ObjectGrid';
import Layout from '../../../layout';
import NodeLeftMenuComponent from './LeftMenu';
import Toolbar from '../../../layout/Toolbar';
import { blur } from '../../../util';
import Breadcrumb from '../../../layout/Breadcrumb';
import MusitModal from '../../movedialog';
import { I18n } from 'react-i18nify';
import { emitError, emitSuccess } from '../../../errors/emitter';
import MusitModalHistory from '../../movehistory';

export default class StorageUnitsContainer extends React.Component {
  static propTypes = {
    children: React.PropTypes.arrayOf(React.PropTypes.object),
    objects: React.PropTypes.arrayOf(React.PropTypes.object),
    rootNode: React.PropTypes.object,
    loadStorageUnits: React.PropTypes.func.isRequired,
    loadStorageObjects: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    onAction: React.PropTypes.func.isRequired,
    props: React.PropTypes.object,
    params: React.PropTypes.object,
    history: React.PropTypes.object,
    routerState: React.PropTypes.object,
    loadChildren: React.PropTypes.func,
    moves: React.PropTypes.arrayOf(React.PropTypes.object),
    moveObject: React.PropTypes.func.isRequired,
    moveNode: React.PropTypes.func.isRequired,
    user: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired
    }),
    loadRoot: React.PropTypes.func.isRequired,
    stats: React.PropTypes.shape({
      nodes: React.PropTypes.number,
      objects: React.PropTypes.number,
      totalObjects: React.PropTypes.number
    })
  };

  static contextTypes = {
    showModal: React.PropTypes.func.isRequired,
    showConfirm: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      searchPattern: '',
      showObjects: false,
      showNodes: true,
      showMoveHistory: false,
      objectData: null,
      showModal: false,
      showModalFromId: '',
      showModalType: ''
    };

    this.loadNodes = this.loadNodes.bind(this);
    this.loadObjects = this.loadObjects.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.moveObject = this.moveObject.bind(this);
    this.showObjectMoveHistory = this.showObjectMoveHistory.bind(this);
    this.onClickCrumb = this.onClickCrumb.bind(this);
    this.showMoveNodeModal = this.showMoveNodeModal.bind(this);
    this.showMoveObjectModal = this.showMoveObjectModal.bind(this);
  }

  componentWillMount() {
    this.loadNodes();
  }

  componentWillReceiveProps(newProps) {
    // Issued on every propchange, including local route changes
    if (newProps.params.id !== this.props.params.id) {
      if (newProps.params.id) {
        this.props.loadChildren(newProps.params.id);
      } else {
        this.props.loadStorageUnits();
      }
    }
  }

  onClickCrumb(node) {
    this.showNodes();
    hashHistory.push(node.url);
  }

  showNodes() {
    this.setState({ ...this.state, showNodes: true, showObjects: false });
  }

  showObjects() {
    this.setState({ ...this.state, showNodes: false, showObjects: true });
  }

  loadNodes() {
    if (this.props.params.id) {
      this.props.loadChildren(this.props.params.id);
    } else {
      this.props.loadStorageUnits();
    }
  }

  loadObjects() {
    if (this.props.params.id) {
      this.props.loadStorageObjects(this.props.params.id);
    }
  }

  showMoveNodeModal = (nodeToMove) => {
    const title = I18n.t('musit.moveModal.moveNode', { name: nodeToMove.name });
    this.context.showModal(title, <MusitModal onMove={this.moveNode(nodeToMove)} />);
  }

  moveNode = (fromNode) => (toId, toName, onSuccess) => {
    this.props.moveNode(fromNode.id, toId, this.props.user.id, {
      onSuccess: () => {
        onSuccess();
        this.loadNodes();
        this.props.loadRoot(this.props.rootNode.id);
        emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.nodeMoved', { name: fromNode.name, destination: toName })
        });
      },
      onFailure: () => {
        emitError({
          type: 'errorOnMove',
          message: I18n.t('musit.moveModal.messages.errorNode', { name: fromNode.name, destination: toName })
        });
      }
    });
  };

  getObjectDescription(object) {
    let objStr = object.museumNo ? `${object.museumNo}` : '';
    objStr = object.subNo ? `${objStr} - ${object.subNo}` : objStr;
    objStr = object.term ? `${objStr} - ${object.term}` : objStr;
    return objStr;
  }

  showMoveObjectModal = (object) => {
    const objStr = this.getObjectDescription(object);
    const title = I18n.t('musit.moveModal.moveObject', { name: objStr });
    this.context.showModal(title, <MusitModal onMove={this.moveObject(object)} />);
  }

  moveObject = (fromObject) => (toId, toName, onSuccess) => {
    const description = this.getObjectDescription(fromObject);
    this.props.moveObject(fromObject.id, toId, this.props.user.id, {
      onSuccess: () => {
        onSuccess();
        this.loadObjects();
        this.props.loadRoot(this.props.rootNode.id);
        emitSuccess({
          type: 'movedSuccess',
          message: I18n.t('musit.moveModal.messages.objectMoved', { name: description, destination: toName })
        });
      },
      onFailure: () => {
        emitError({
          type: 'errorOnMove',
          message: I18n.t('musit.moveModal.messages.errorObject', { name: description, destination: toName })
        });
      }
    });
  };

  showObjectMoveHistory = (object) => {
    const objStr = this.getObjectDescription(object);
    const componentToRender = <MusitModalHistory objectId={object.id} />;
    const title = `${I18n.t('musit.moveHistory.title')} ${objStr}`;
    this.context.showModal(title, componentToRender);
  }

  makeToolbar() {
    return <Toolbar
      showRight={this.state.showObjects}
      showLeft={this.state.showNodes}
      labelRight="Objekter"
      labelLeft="Noder"
      placeHolderSearch="Filtrer i liste"
      searchValue={this.state.searchPattern}
      onSearchChanged={(newPattern) => this.setState({ ...this.state, searchPattern: newPattern })}
      clickShowRight={() => {
        this.showObjects();
        this.loadObjects();
        blur();
      }}
      clickShowLeft={() => {
        this.showNodes();
        this.loadNodes();
        blur();
      }}
    />;
  }

  makeLeftMenu(rootNode, statistics) {
    const { onEdit, onDelete } = this.props;
    const showButtons = this.props.routerState.locationBeforeTransitions.pathname !== '/magasin/root';
    return (
      <div style={{ paddingTop: 10 }}>
        <NodeLeftMenuComponent
          rootNode={rootNode}
          showButtons={showButtons}
          onClickNewNode={(parentId) => {
            if (parentId) {
              hashHistory.push(`/magasin/${parentId}/add`);
            } else {
              hashHistory.push('/magasin/add');
            }
          }}
          objectsOnNode={statistics ? statistics.numObjects : Number.NaN}
          totalObjectCount={statistics ? statistics.totalObjects : Number.NaN}
          underNodeCount={statistics ? statistics.numNodes : Number.NaN}
          onClickProperties={(id) => onEdit({ id })}
          onClickControlObservations={(id) => hashHistory.push(`/magasin/${id}/controlsobservations`)}
          onClickObservations={(id) => hashHistory.push(`/magasin/${id}/observations`)}
          onClickController={(id) => hashHistory.push(`/magasin/${id}/controls`)}
          onClickMoveNode={this.showMoveNodeModal}
          onClickDelete={(id) => {
            const message = I18n.t('musit.leftMenu.node.deleteMessages.askForDeleteConfirmation', {name: rootNode.name});
            this.context.showConfirm(message, () => onDelete(id, rootNode));
          }}
        />
      </div>
    );
  }

  makeContentGrid(filter, rootNode, children) {
    const nodeId = rootNode ? rootNode.id : null;
    if (this.state.showNodes) {
      return <NodeGrid
        id={nodeId}
        tableData={children.filter((row) => row.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1)}
        onAction={(action, unit) => this.props.onAction(action, unit, this.props.rootNode.breadcrumb)}
        onMove={this.showMoveNodeModal}
        onClick={(row) =>
          hashHistory.push(
            `/magasin/${row.id}`
          )
        }
        rootNode={this.props.rootNode}
      />;
    }
    return <ObjectGrid
      id={nodeId}
      tableData={this.props.objects}
      showMoveHistory={this.showObjectMoveHistory}
      onAction={(action, unit) => this.props.onAction(action, unit, this.props.rootNode.breadcrumb)}
      onMove={this.showMoveObjectModal}
      rootNode={this.props.rootNode}
    />;
  }

  render() {
    const { searchPattern } = this.state;
    const { children, rootNode } = this.props;
    return (
      <div>
        <Layout
          title={'Magasin'}
          breadcrumb={<Breadcrumb node={rootNode} onClickCrumb={this.onClickCrumb} />}
          toolbar={this.makeToolbar()}
          leftMenu={this.makeLeftMenu(rootNode, this.props.stats)}
          content={this.makeContentGrid(searchPattern, rootNode, children)}
        />
      </div>
    );
  }
}