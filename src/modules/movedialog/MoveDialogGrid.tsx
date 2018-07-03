import * as React from 'react';
import { Component } from 'react';
import { Table, FormGroup } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import './MoveDialogGrid.css';
import { I18n } from 'react-i18nify';

interface ModalNodeGridProps {
  tableData: Array<{ name: string; type: string }>;
  onClick: Function;
}
/*#OLD
  static propTypes = {
    tableData: PropTypes.arrayOf(PropTypes.object),
    onClick: PropTypes.func.isRequired
  };

*/
export default class ModalNodeGrid extends Component<ModalNodeGridProps> {
  render() {
    return (
      <FormGroup>
        <div>
          <Table responsive hover className="modalNodeGrid">
            <tbody>
              {this.props.tableData.map((c, i) => (
                <tr key={i} id={`${i}`}>
                  <td id={`${i}_${c.name}`}>
                    <a
                      href=""
                      onClick={e => {
                        e.preventDefault();
                        this.props.onClick(c);
                      }}
                    >
                      <FontAwesome name="folder" />
                      {` ${c.name}`}
                    </a>
                  </td>
                  <td id={`${i}_${c.type}`}>
                    {I18n.t(`musit.grid.node.nodeTypeItems.${c.type}`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </FormGroup>
    );
  }
}
