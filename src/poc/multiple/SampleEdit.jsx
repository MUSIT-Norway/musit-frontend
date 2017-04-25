import React from 'react';
import SampleDetails from '../components/SampleDetails';
import Dropdown from '../components/Dropdown';
import { Button } from 'react-bootstrap';
import downImg from '../assets/down.png';
import upImg from '../assets/up.png';
import '../assets/style.css';

class SampleEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: {}
    };
  }

  render() {
    return (
      <ObjectList
        goTo={this.props.history.push}
        active={this.state.active}
        setActive={(index) =>
          this.setState({...this.state, active: {...this.state.active, [index]: !this.state.active[index] }})
        }
      />
    );
  }
}

export default SampleEdit;

const ObjectSamples = ({ active, setActive, indexes }) => (
  <table className="table table-bordered table-striped" id="samples" style={{ backgroundColor: 'white'}}>
    {!active[indexes[0]] &&
    <thead>
      <tr>
        <th>Prøve ID</th>
        <th>Prøvetype</th>
        <th>Status</th>
        <th colSpan={2}>Prøvevolum/-vekt</th>
        <th>Lagringskontainer</th>
        <th>Lagringsmedium</th>
        <th width={10}>&nbsp;</th>
      </tr>
    </thead>
    }
    <tbody>
    {!active[indexes[0]] ?
      <tr>
        <td style={{paddingLeft: 5}}>
          <input className="form-control" name="id"/>
        </td>
        <td style={{paddingLeft: 5}}>
          <Dropdown />
        </td>
        <td style={{paddingLeft: 5}}>
          <Dropdown />
        </td>
        <td style={{paddingLeft: 5}}>
          <input className="form-control"/>
        </td>
        <td style={{paddingLeft: 5}}>
          <Dropdown />
        </td>
        <td style={{paddingLeft: 5}}>
          <Dropdown />
        </td>
        <td style={{paddingLeft: 5}}>
          <Dropdown />
        </td>
        <td onClick={() => setActive(indexes[0])}>
          <img src={!active[indexes[0]] ? downImg : upImg} width={20} role="presentation"/>
        </td>
      </tr>
      :
      <tr>
        <td style={{ textAlign: 'right' }} onClick={() => setActive(indexes[0])}>
          <img src={!active[indexes[0]] ? downImg : upImg} width={20} role="presentation"/>
        </td>
      </tr>
    }
      <tr id="collapse1" className={'collapse ' + active[indexes[0]] ? 'in' : 'out'} hidden={!active[indexes[0]]}>
        <td>
          <SampleDetails />
        </td>
      </tr>
    </tbody>
  </table>
);


const ObjectList = ({ active, setActive }) => (
  <div>
    <h1>Prøveuttak</h1>
    <hr />
    <div className="well">
      <div style={{paddingLeft: 1}}>
        <b>Avledes fra objekt</b>
        <br />
        <b>Museumsnr:</b> 1234 <b>Unr:</b> 12345678901 <b>Term/Artsnavn:</b> Kniv <a href="#">Se detaljer</a>
        <ObjectSamples active={active} setActive={setActive} indexes={[1]} />
        <br />
        <b>Avledes fra objekt</b>
        <br />
        <b>Museumsnr:</b> 1234 <b>Unr:</b> 12345678901 <b>Term/Artsnavn:</b> Kniv <a href="#">Se detaljer</a>
        <ObjectSamples active={active} setActive={setActive} indexes={[2]} />
      </div>
      <Button
        bsStyle="primary"
      >
        Lagre prøveuttak
      </Button>
    </div>
  </div>
);