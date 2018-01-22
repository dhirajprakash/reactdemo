import React, { Component } from 'react';
import './App.css';
 import {Button, Badge} from 'reactstrap';
import UploadFile from "./UploadFile";

class App extends Component {

    constructor(props) {
        super(props);
        this.state ={
            displayReport: true,
            displayUpload: false
        }
    }

    manageDisplay(component) {
        if (component === 'report'){
            this.setState({displayReport: true, displayUpload: false});
        } else if(component === 'upload') {
            this.setState({displayReport: false, displayUpload: true});
        }
    }

  render() {
    return (
      <div className="App container-fluid">
          <div className="row">
              <nav className="navbar navbar-dark bg-dark fixed-top"  style={{height: '6vh'}}>
                  <h4><Badge color="light">Integracaodeforcas</Badge></h4>
                  <Button size="sm" outline color="warning">Log Out</Button>
              </nav>
          </div>
          <div className="row">
              <div className="col-2 bg-dark btn-group" style={{marginTop: '7vh', height: '93vh'}}>
                  <div className="nav flex-column btn-block mt-2">
                      <Button outline color="primary" onClick={this.manageDisplay.bind(this, 'report')}>Reports</Button>
                      <Button outline color="primary" className="mt-1" onClick={this.manageDisplay.bind(this, 'upload')}>Upload</Button>
                  </div>
              </div>
              <div className="col-9" style={{display: this.state.displayUpload ? '' : 'none'}}>
                  <UploadFile/>
              </div>
          </div>
      </div>
    );
  }
}

export default App;
