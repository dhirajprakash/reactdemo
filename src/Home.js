import React, { Component } from 'react';
import './App.css';
import {Button, Badge, FormGroup, Form, Col, Label} from 'reactstrap';
import UploadFile from "./UploadFile";
import { withAuth } from '@okta/okta-react';
import logo from './logo.jpg';
import FaArrowCircleORight from 'react-icons/lib/fa/arrow-circle-o-right';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state ={
            authenticated: null,
            displayReport: false,
            displayUpload: true,
            userName: '',
            userEmail: ''
        }
        this.checkAuthentication = this.checkAuthentication.bind(this);
        this.checkAuthentication();
    }

    manageDisplay(component) {
        if (component === 'report'){
            this.setState({displayReport: true, displayUpload: false});
        } else if(component === 'upload') {
            this.setState({displayReport: false, displayUpload: true});
        }
    }

    async checkAuthentication() {
        const authenticated = await this.props.auth.isAuthenticated();
        const userInfo = await this.props.auth.getUser();
        console.log(userInfo);

        if (authenticated !== this.state.authenticated) {
            this.setState({ authenticated });
            if(userInfo) {
                this.setState({userName: userInfo.name, userEmail: userInfo.email});
            }
        }
    }

    componentDidUpdate() {
        this.checkAuthentication();
    }

    render() {
        if (this.state.authenticated === null) return null;
        let template;

        if(!this.state.authenticated ){
            template = <div className="App-home container-fluid">
                <br/><br/>
                <Form onSubmit={this.handleSubmit}  style={{marginLeft:450, marginTop:50}}>
                    <FormGroup row>
                        <Col sm={5}>
                            <img src={logo} height="150" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="username" sm={4} align="center"><Button size="sm" outline color="warning" onClick={this.props.auth.login}>Log In <FaArrowCircleORight style={{marginTop:-2}}/></Button></Label>
                    </FormGroup>
                </Form>
            </div>;
        } else if(this.state.authenticated) {
            template =
                <div className="App container-fluid">
                    <div className="row">
                        <nav className="navbar navbar-dark bg-dark fixed-top" style={{height: '6vh'}}>
                            <h4><Badge color="light">Integracaodeforcas</Badge></h4>

                            <div>
                                <Badge color="dark">{this.state.userName}</Badge>
                                &nbsp;&nbsp;
                                <Button size="sm" outline color="warning" onClick={this.props.auth.logout}>Log Out</Button>
                            </div>
                        </nav>
                    </div>
                    <div className="row">
                        <div className="col-2 bg-dark btn-group" style={{marginTop: '7vh', height: '93vh'}}>
                            <div className="nav flex-column btn-block mt-2">
                                <Button outline color="warning" className="mt-1"
                                        onClick={this.manageDisplay.bind(this, 'upload')}>Upload</Button>
                                <Button outline color="warning"
                                        onClick={this.manageDisplay.bind(this, 'report')}>Reports</Button>
                            </div>
                        </div>
                        <div className="col-9" style={{display: this.state.displayUpload ? '' : 'none'}}>
                            <UploadFile userId={this.state.userEmail}/>
                        </div>
                    </div>
                </div>
            ;
        }

        return (
          <div>
              {/*<Link to='/'>Home</Link><br/>
              <Link to='/protected'>Protected</Link><br/>*/}
              {template}
          </div>
        );
    }
}

export default withAuth(Home);
