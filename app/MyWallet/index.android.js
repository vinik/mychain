/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import Auth0Lock from 'react-native-lock';
var lockOptions = {
    scope: 'openid email'
}
var lock = new Auth0Lock({clientId: 'weRGYvj1bVbHDCBfEsqFA3cssasg0HkF', domain: 'vinik.auth0.com', options: lockOptions});

var appState = {
    profile: {
        name: "",
        email: ""
    },
    token: {
        idToken: ""
    }
}

var serverUrl = 'http://192.168.1.125:9091';

export default class MyWallet extends Component {
    constructor(props) {
    super(props);
    this.state = appState;

    lock.show({}, (err, profile, token) => {
        if (err) {
            console.log(err);
            return;
        }

        // Authentication worked!
        console.log('Logged in with Auth0!');
        console.log(token);

        appState.profile = profile;
        appState.token = token;
        this.setState(appState);

        fetch(serverUrl + '/query/account', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + appState.token.accessToken
            }
        }).then((response) => response.json())
        .then((responseJson) => {
            //appState.assets = responseJson;
            //this.setState(appState);
            console.log(responseJson);
        }).catch((error) => {
            console.error(error);
        });

    });

  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome {this.state.profile.name}</Text>
        <Text>{this.state.profile.email}</Text>
        <Text>token: {this.state.token.idToken}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('MyWallet', () => MyWallet);
