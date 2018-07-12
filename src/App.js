import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import Login from './Login';
import Protected from './Protected';
import Helper from "./Helper";

function onAuthRequired({history}) {
    history.push('/login');
}

const config = {
    issuer: 'https://dev-512547.oktapreview.com/oauth2/default',
    redirect_uri: window.location.origin + '/implicit/callback',
    client_id: Helper.getClientId()
}



class App extends Component {

  render() {
    return (
        <Router>
            <Security issuer={config.issuer}
                      client_id={config.client_id}
                      redirect_uri={config.redirect_uri}
                      onAuthRequired={onAuthRequired}>

                <Route path='/' exact={true} component={Home}/>
                <SecureRoute path='/protected' component={Protected} />
                <Route path='/login' render={() => <Login baseUrl='https://dev-512547.oktapreview.com' />} />
                <Route path='/implicit/callback' component={ImplicitCallback}/>
            </Security>
        </Router>
    );
  }
}

export default App;
