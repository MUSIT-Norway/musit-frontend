import React from 'react';
import Dropdown from './Dropdown';
import { Button } from 'react-bootstrap';

export default () => (
  <form className="form-horizontal">
    <div className="form-group">
      <label className="control-label col-sm-2" htmlFor="type">Prøve ID:</label>
      <div className="col-sm-2">
        <input name="id" className="form-control" />
      </div>
    </div>
    <div className="form-group">
      <label className="control-label col-sm-2" htmlFor="type">Prøvetype:</label>
      <div className="col-sm-2">
        <Dropdown id="type" />
      </div>
    </div>
    <div className="form-group">
      <label className="control-label col-sm-2" htmlFor="type">Prøveundertype:</label>
      <div className="col-sm-2">
        <Dropdown id="subtype" />
      </div>
    </div>
    <div className="form-group">
      <label className="control-label col-sm-2" htmlFor="type">Status:</label>
      <div className="col-sm-2">
        <Dropdown id="status" />
      </div>
    </div>
    <div className="form-group">
      <label className="control-label col-sm-2" htmlFor="type">Prøvevolum/vekt:</label>
      <div className="col-sm-1">
        <input className="form-control" type="text"/>
      </div>
      <div className="col-sm-2">
        <Dropdown id="weight" />
      </div>
    </div>
    <div className="form-group">
      <label className="control-label col-sm-2" htmlFor="type">Lagrinskontainer:</label>
      <div className="col-sm-2">
        <Dropdown id="container" />
      </div>
    </div>
    <div className="form-group">
      <label className="control-label col-sm-2" htmlFor="type">Lagringsmedium:</label>
      <div className="col-sm-2">
        <Dropdown id="medium" />
      </div>
    </div>
    <div className="form-group">
      <label className="control-label col-sm-2" htmlFor="type">Restmateriale:</label>
      <div className="col-sm-2">
        <label className="radio-horizontal"><input name="optradio" type="radio"/>Ja</label> <label
        className="radio-horizontal"><input checked="checked" name="optradio" type="radio"/>Nei</label>
      </div>
    </div>
    <div className="form-group">
      <label className="control-label col-sm-2" htmlFor="type">Kommentar:</label>
      <div className="col-sm-2">
        <textarea cols="40" rows="5"/>
      </div>
    </div>
    <div className="form-group">
      <label className="control-label col-sm-2" htmlFor="role">Personer:</label>
      <div className="col-sm-6">
        <table className="table">
          <thead>
          <tr>
            <th>Navn</th>
            <th>Rolle</th>
            <th>Dato</th>
            <th>&nbsp;</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td><input name="name" className="form-control" placeholder="navn" type="text" value=""/></td>
            <td>
              <Dropdown />
            </td>
            <td>&nbsp;</td>
            <td>
              <Button className="btn btn-default" type="button">Legg til</Button>
            </td>
          </tr>
          </tbody>
        </table>
        <Button>Legg til flere personer</Button>
      </div>
    </div>
  </form>
);