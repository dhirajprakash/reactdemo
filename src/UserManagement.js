import React, { Component } from 'react';
import './App.css';
import {Badge, Button, FormGroup, Col, Input, Form, InputGroup, InputGroupAddon} from 'reactstrap';
import 'react-table/react-table.css';
import { withAuth } from '@okta/okta-react';
import fetch from 'isomorphic-fetch';
import Helper from './Helper';
import FaCheckCircle from 'react-icons/lib/fa/check-circle';
import TiDelete from 'react-icons/lib/ti/delete';

class UserManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstNameValid: '',
            lastNameValid: '',
            emailIdValid: '',
            firstName: '',
            lastName: '',
            emailId: ''
        }

        this.addUser = this.addUser.bind(this);
        this.validate = this.validate.bind(this);
    }

    /*async componentDidMount() {
        try {
            const response = await fetch(this.API_URL + 'reports', {
                headers: {
                    Authorization: 'Bearer ' + await this.props.auth.getAccessToken(),
                    UserId: this.props.userId
                }
            });
            const data = await response.json();
            if(data && data.length > 0) {
                this.setState({reports: data, searchResult: data});
            } else {
                this.setState({noDataText: 'No reports found!'});
            }

        } catch(err){
            this.setState({noDataText: 'No reports found!'});
            console.log(err);
        }
    }*/
    validate(e) {
        const targetName = e.target.name;
        const targetValue = e.target.value;
        console.log(targetName);
        console.log(targetValue);
        if(targetName === 'nmFirstName') {
            if(targetValue.trim() === '') {
                this.setState({firstNameValid: 'N'});
            } else {
                this.setState({firstNameValid: 'Y', firstName: targetValue});
            }
        } else if(targetName === 'nmLastName') {
            if(targetValue.trim() === '') {
                this.setState({lastNameValid: 'N'});
            } else {
                this.setState({lastNameValid: 'Y', lastName: targetValue});
            }
        } else if(targetName === 'nmEmail') {
            console.log(targetValue);
            console.log(Helper.isEmailValid(targetValue));
            if(Helper.isEmailValid(targetValue)) {
                this.setState({emailIdValid: 'Y', emailId: targetValue});
            } else {
                this.setState({emailIdValid: 'N'});
            }
        }
    }

    async addUser() {
        try {
            const user = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                userId: this.state.emailId
            };

            const response = await fetch(Helper.getAPI() + 'users/create', {
                headers: {
                    Authorization: 'Bearer ' + await this.props.auth.getAccessToken(),
                    'Content-Type': 'application/json'
            },
                method: 'POST',
                body: JSON.stringify(user)
        });
            const data = await response.json();
            /*if(data && data.length > 0) {
                this.setState({reports: data, searchResult: data});
            } else {
                this.setState({noDataText: 'No reports found!'});
            }*/

        } catch(err){
            console.log('error in creating user!');
        }
    }

    render() {
        return (
            <div className="mt-5">
                <h5><Badge color="light">Add User</Badge></h5>
                <br/>
                <div style={{border:'0px solid grey'}}>
                    <Form>
                        <FormGroup row className="mt-2 ml-2 mr-2">
                            <Col sm={3}>
                                <InputGroup>
                                    <Input type="email" name="nmEmail" id="idEmail" placeholder="email id" onBlur={this.validate} />
                                    <InputGroupAddon addonType="append" className="bg-light" style={{display: this.state.emailIdValid==='Y'?'':'none'}}>
                                        <FaCheckCircle style={{color: 'green'}}/>
                                    </InputGroupAddon>
                                    <InputGroupAddon addonType="append" className="bg-light" style={{display: this.state.emailIdValid==='N'?'':'none'}}>
                                        <TiDelete style={{color: 'red'}}/>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Col>

                            <Col sm={3}>
                                <InputGroup>
                                    <Input type="text" name="nmFirstName" id="idFirstName" placeholder="first name" onBlur={this.validate} />
                                    <InputGroupAddon addonType="append" className="bg-light" style={{display: this.state.firstNameValid==='Y'?'':'none'}}>
                                        <FaCheckCircle style={{color: 'green'}}/>
                                    </InputGroupAddon>
                                    <InputGroupAddon addonType="append" className="bg-light" style={{display: this.state.firstNameValid==='N'?'':'none'}}>
                                        <TiDelete style={{color: 'red'}}/>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Col>

                            <Col sm={3}>
                                <InputGroup>
                                    <Input type="text" name="nmLastName" id="idLastName" placeholder="last name" onBlur={this.validate} />
                                    <InputGroupAddon addonType="append" className="bg-light" style={{display: this.state.lastNameValid==='Y'?'':'none'}}>
                                        <FaCheckCircle style={{color: 'green'}}/>
                                    </InputGroupAddon>
                                    <InputGroupAddon addonType="append" className="bg-light" style={{display: this.state.lastNameValid==='N'?'':'none'}}>
                                        <TiDelete style={{color: 'red'}}/>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Col>

                            <Col sm={3}>
                                <Button size="sm" disabled={!(this.state.firstNameValid==='Y' && this.state.lastNameValid==='Y' && this.state.emailIdValid==='Y')} className="mt-1" outline color="warning" onClick={this.addUser}>Add User</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>
             </div>
        );
    }
}

export default withAuth(UserManagement);
