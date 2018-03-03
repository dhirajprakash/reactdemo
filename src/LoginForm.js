import React, { Component } from 'react';
import OktaAuth from '@okta/okta-auth-js';
import { withAuth } from '@okta/okta-react';
import {Button, FormGroup, Label, Input, Form, Badge, Col} from 'reactstrap';
import FaArrowCircleORight from 'react-icons/lib/fa/arrow-circle-o-right';
import logo from './logo.jpg';

export default withAuth(class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionToken: null,
            username: '',
            password: ''
        }

        this.oktaAuth = new OktaAuth({ url: props.baseUrl });

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.oktaAuth.signIn({
            username: this.state.username,
            password: this.state.password
        })
            .then(res => this.setState({
                sessionToken: res.sessionToken
            }))
            .catch(err => console.log('Found an error', err));
    }

    handleUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    render() {
        if (this.state.sessionToken) {
            this.props.auth.redirect({sessionToken: this.state.sessionToken});
            return null;
        }

        return (
            <div className="App-home container-fluid">
            <br/><br/>

                <Form onSubmit={this.handleSubmit}  style={{marginLeft:450, marginTop:50}}>
                    <FormGroup row>
                        <Col sm={5}>
                        <img src={logo} height="150" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={4}>
                        <Input type="email" name="email" id="username" placeholder="user id" value={this.state.username} onChange={this.handleUsernameChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={4}>
                        <Input type="password" name="password" id="password" placeholder="password" value={this.state.password} onChange={this.handlePasswordChange} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="username" sm={4} align="center"><Button size="sm" outline color="warning" onClick={this.handleSubmit}>Enter <FaArrowCircleORight style={{marginTop:-2}}/></Button></Label>
                    </FormGroup>
                </Form>
            </div>
        );
    }
});