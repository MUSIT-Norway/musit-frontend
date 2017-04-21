import React from 'react';

const Dropdown = ({ id }) => (
  <select className="form-control" id={id}>
    <option>
      1
    </option>
    <option>
      2
    </option>
    <option>
      3
    </option>
    <option>
      4
    </option>
  </select>
);

export default () => (
  <form className="form-horizontal">
    <div className="form-group">
      <label className="control-label col-sm-2" htmlFor="type">Prøvetype:</label>
      <div className="col-sm-2">
        <Dropdown id="type" />
      </div>
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
            <td><input name="name" placeholder="navn" type="text" value=""/></td>
            <td>
              <div className="dropdown">
                <button
                  aria-expanded="true"
                  aria-haspopup="true"
                  className="btn btn-default dropdown-toggle"
                  data-toggle="dropdown"
                  id="dropdownMenu1"
                  type="button"
                >
                  Rolle
                </button>
                <ul aria-labelledby="dropdownMenu1" className="dropdown-menu">
                  <li>
                    <a href="#">Ansvarlig</a>
                  </li>
                  <li>
                    <a href="#">Totalt uansvarlig</a>
                  </li>
                  <li>
                    <a href="#">Innkjøpsansvarlig</a>
                  </li>
                </ul>
              </div>
            </td>
            <td>&nbsp;</td>
            <td>
              <button className="btn btn-default" type="button">Legg til</button>
            </td>
          </tr>
          </tbody>
        </table>
        <button className="btn btn-default">Legg til flere personer</button>
      </div>
    </div>
  </form>
);