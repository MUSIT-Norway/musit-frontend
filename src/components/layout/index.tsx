/*
 *  MUSIT is a museum database to archive natural and cultural history data.
 *  Copyright (C) 2016  MUSIT Norway, part of www.uio.no (University of Oslo)
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License,
 *  or any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import * as React from "react";
import { Grid, Row, Col, PageHeader } from "react-bootstrap";
import { TODO } from "../../types/common";

interface LayoutProps  {
  title: any; // any.isRequired,
  leftMenu?: object; // PropTypes.object,
  content: object; //object.isRequired,
  breadcrumb: JSX.Element; // Breadcrumb; // PropTypes.element,
  toolbar?: TODO; // PropTypes.element
};

/*


  static propTypes = {
    title: PropTypes.any.isRequired,
    leftMenu: PropTypes.object,
    content: PropTypes.object.isRequired,
    breadcrumb: PropTypes.element,
    toolbar: PropTypes.element
  };

*/

export default class Layout extends React.Component<LayoutProps> {
  static defaultProps = {
    leftMenu: (
      <div
        style={{
          minHeight: 0
        }}
      />
    ),
    toolbar: <span />
  };

  render() {
    return (
      <div style={{ paddingTop: 20 }}>
        <main>
          <Grid>
            <Row>
              <PageHeader style={{ marginTop: 0 }}>{this.props.title}</PageHeader>
            </Row>
            <Row style={{ paddingBottom: 10 }}>
              <Col
                md={6}
                mdOffset={2}
                style={{
                  display: "inline-block",
                  lineHeight: "30px",
                  verticalAlign: "center"
                }}
              >
                {this.props.breadcrumb}
              </Col>
              <Col md={3} mdOffset={0} style={{ marginLeft: "20px" }}>
                {this.props.toolbar}
              </Col>
            </Row>
            <Row>
              <div className="container-fluid">
                <div className="row content">
                  <div
                    className="col-md-2 sidenav"
                    style={{
                      borderTop: "#cdcdcd 1px solid",
                      borderRight: "#cdcdcd 1px solid"
                    }}
                  >
                    {this.props.leftMenu}
                  </div>
                  <div
                    className="col-md-10"
                    style={{
                      borderTop: "#cdcdcd 1px solid",
                      minHeight: 100,
                      borderLeft: "#cdcdcd 1px solid"
                    }}
                  >
                    {this.props.content}
                  </div>
                </div>
              </div>
            </Row>
          </Grid>
        </main>
      </div>
    );
  }
}


