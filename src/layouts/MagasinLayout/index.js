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
import React from 'react'
import { Grid, Row, Col, PageHeader } from 'react-bootstrap'

export default class Layout extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    translate: React.PropTypes.func.isRequired,
    leftMenu: React.PropTypes.object,
    content: React.PropTypes.object.isRequired,
    breadcrumb: React.PropTypes.element,
    toolbar: React.PropTypes.element
  }

  static defaultProps = {
    leftMenu: <div
      style={{
        minHeight: 0
      }}
    />,
    toolbar: <span />
  }

  render () {
    return (
      <div style={{ paddingTop: 20 }}>
        <main>
          <Grid>
            <Row>
              <PageHeader style={{ marginTop: 0 }}>{this.props.title}</PageHeader>
            </Row>
            <Row style={{ paddingBottom: 10 }}>
              <Col md={6} mdOffset={2} style={{ display: 'inline-block', lineHeight: '30px', verticalAlign: 'center' }}>
                {this.props.breadcrumb}
              </Col>
              <Col md={3} mdOffset={1} >
                {this.props.toolbar}
              </Col>
            </Row>
            <Row>
              <div className='container-fluid'>
                <div className='row content'>
                  <div
                    className='col-md-2 sidenav'
                    style={{ borderTop: '#cdcdcd 1px solid', borderRight: '#cdcdcd 1px solid' }}
                  >
                    {this.props.leftMenu}
                  </div>
                  <div
                    className='col-md-10'
                    style={{ borderTop: '#cdcdcd 1px solid', minHeight: 100, borderLeft: '#cdcdcd 1px solid' }}
                  >
                    {this.props.content}
                  </div>
                </div>
              </div>
            </Row>
          </Grid>
        </main>
      </div>
    )
  }
}
