// @flow
import React from 'react';
import ObjectResultTable from './ObjectResultTable';
import type { AppSession } from '../../../types/appSession';
import type { History } from '../../../types/Routes';

type Object = {
  objectId?: string,
  uuid?: string
};

type Props = {
  data: Array<Object>,
  renderExpanded?: (props: { index: number, data: Object }) => React.Element<*>,
  updateForm?: Function,
  extraAttributes?: any,
  history: History,
  appSession: AppSession,
  viewMode?: ?boolean
};

type State = {
  expandedRowIds: Array<string>
};

export default class ExpandableObjectTable extends React.Component {
  state: State;
  props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      expandedRowIds: []
    };
  }

  handleRowClick(row: Object) {
    const rowId = ExpandableObjectTable.toRowId(row);
    const currentExpandedRows = this.state.expandedRowIds;
    const isRowCurrentlyExpanded = ExpandableObjectTable.isRowIdExpanded(
      currentExpandedRows,
      rowId
    );

    const newExpandedRows = isRowCurrentlyExpanded
      ? currentExpandedRows.filter(id => id !== rowId)
      : currentExpandedRows.concat(rowId);

    this.setState({ expandedRowIds: newExpandedRows });
  }

  static isRowIdExpanded(currentExpandedRows: Array<string>, rowId: string) {
    return currentExpandedRows.find(er => er === rowId);
  }

  static toRowId(row: Object) {
    return row.objectId || row.uuid;
  }

  static mergeWithExpanded(data, expandedRowIds) {
    return data.map(obj => ({
      ...obj,
      result: { ...obj.result },
      expanded: ExpandableObjectTable.isRowIdExpanded(
        expandedRowIds,
        ExpandableObjectTable.toRowId(obj)
      )
    }));
  }

  render() {
    return (
      <ObjectResultTable
        {...this.props}
        data={ExpandableObjectTable.mergeWithExpanded(
          this.props.data,
          this.state.expandedRowIds
        )}
        {...this.state}
        handleClickRow={this.handleRowClick.bind(this)}
        toRowId={ExpandableObjectTable.toRowId}
        appSession={this.props.appSession}
        history={this.props.history}
        viewMode={this.props.viewMode}
      />
    );
  }
}
