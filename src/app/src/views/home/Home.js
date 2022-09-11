import { Component } from 'react';
import Badge from 'react-bootstrap/Badge';
import MainService from '../../services/mainService';

class Home extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append('statement', document.getElementById('fileInput').files[0]);
    MainService.addStatementFile(formData);
  }
  
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Relevé de compte :
            <input id="fileInput" type="file"/>
          </label>
          <button type="submit">OK</button>
          <Badge bg="secondary">New</Badge>
        </form>
      </div>
    )
  }
}

export default Home;