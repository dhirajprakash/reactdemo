import React, { Component } from 'react';
import OktaAuth from '@okta/okta-auth-js';
import { withAuth } from '@okta/okta-react';
import {Button, FormGroup, Label, Input, Form, Badge, Col, ModalBody, ModalFooter, Modal} from 'reactstrap';
import FaArrowCircleORight from 'react-icons/lib/fa/arrow-circle-o-right';
import {FadeLoader} from 'react-spinners';
import fetch from "isomorphic-fetch";
import Helper from "./Helper";

export default withAuth(class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionToken: null,
            username: '',
            password: '',
            authError: false,
            logInClicked: false,
            passwordRequested: false
        }

        this.oktaAuth = new OktaAuth({ url: props.baseUrl });

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleSubmit(e) {
        this.setState({authError: false, logInClicked: true});
        e.preventDefault();
        this.oktaAuth.signIn({
            username: this.state.username,
            password: this.state.password
        })
            .then(res => this.setState({
                sessionToken: res.sessionToken
            }))
            .catch(err => {
                console.log('Found an error', err);
                this.setState({authError: true, logInClicked: false});
            });
    }

    handleUsernameChange(e) {
        this.setState({username: e.target.value, authError: false});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value, authError: false});
    }

    async forgotPassword() {
        console.log('forgot password!');
        this.setState({passwordRequested: true});
        try {
            const response = await fetch(Helper.getAPI() + 'resend-password', {
                headers: {
                    UserId: this.state.username
                }
            });
            const data = await response.text();
            console.log(data);

        } catch (err) {
            console.log(err);
        }
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
                            <h3 style={{marginLeft: -8}}><Badge color="info">INTEGRACAODEFORCAS</Badge></h3>
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
                    <FormGroup row style={{display: this.state.logInClicked ? 'none' : ''}}>
                        <Label for="username" sm={4} align="center">
                            <Button outline color="warning" onClick={this.handleSubmit}>Enter&nbsp;
                                <FaArrowCircleORight style={{marginTop:-2}}/>
                            </Button>
                        </Label>
                    </FormGroup>
                    <FormGroup row style={{display: this.state.logInClicked ? '' : 'none'}}>
                        <div className='sweet-loading' style={{marginLeft: 110}}>
                            <FadeLoader color={'#ffc107'} loading/>
                        </div>
                    </FormGroup>
                    <FormGroup row style={{display: this.state.authError ? '' : 'none'}}>
                        <Label sm={4} className="text-white" align="center">Falha em Login!&nbsp;&nbsp; <a className="text-white action-link" onClick={this.forgotPassword.bind(this)}><u> Esqueci Senha ?</u></a></Label>
                    </FormGroup>
                </Form>

                <div>
                    <Modal isOpen={this.state.passwordRequested} style={{marginTop: 150}} size="sm" centered="true">
                        <ModalBody className="font-common">
                            O senha vai ser mandado para  {this.state.username} agora. Favor entre em email . Se ainda nao recbeu senha , entre em contato com Administrador.
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" size="sm" onClick={() => this.setState({passwordRequested: false})}>OK</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        );
    }
});