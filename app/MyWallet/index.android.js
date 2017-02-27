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

var lock = new Auth0Lock({clientId: 'YNEBjn3iaKQtHeO0aGXra7a1FLQXR9KU', domain: 'vinik.auth0.com'});



export default class MyWallet extends Component {
    constructor(props) {
    super(props);
    this.state = {profile: {name: ""}};

    lock.show({}, (err, profile, token) => {
      if (err) {
        console.log(err);
        return;
      }
      // Authentication worked!
      console.log('Logged in with Auth0!');

      // this.state.profile = profile;
      // this.state.token = token;

      this.setState({profile: profile})
    });

  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome {this.state.profile.name}</Text>
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
