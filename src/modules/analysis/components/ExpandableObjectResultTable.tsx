// @flow
import * as React from 'react';
import ObjectResultTable from './ObjectResultTable';
import { AppSession } from '../../../types/appSession';
import { History } from 'history';
import { ExtraResultAttributeValues } from '../../../types/analysis';
import { Star, Maybe, MUSTFIX, TODO } from '../../../types/common';

type Props = {
  data: Array<any>;
  renderExpanded?: (props: { index: number; data: Object }) => React.ReactElement<Star>;
  extraAttributes?: Maybe<ExtraResultAttributeValues>;
  history: History;
  appSession: AppSession;
  viewMode?: Maybe<boolean>;
};

type State = {
  expandedRowIds: Array<string>;
};

export default class ExpandableObjectTable extends React.Component<Props, State> {
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

    this.setState(() => ({ expandedRowIds: newExpandedRows }));
  }

  static isRowIdExpanded(currentExpandedRows: Array<string>, rowId: string): boolean {
    return !!currentExpandedRows.find(er => er === rowId);
  }

  static toRowId(row: MUSTFIX) {
    return row.affectedThing || row.objectId || row.uuid;
  }

  static mergeWithExpanded(data: TODO, expandedRowIds: TODO) {
    return data.map((obj: TODO) => ({
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
        //Removed? toRowId={ExpandableObjectTable.toRowId}
        appSession={this.props.appSession}
        history={this.props.history}
        viewMode={this.props.viewMode}
      />
    );
  }
}
