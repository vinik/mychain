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
    View,
    ListView
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

var serverUrl = 'http://10.40.8.125:9091';

export default class MyWallet extends Component {
    constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    appState.dataSource = ds.cloneWithRows(['row1', 'row 2']);
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
            appState.dataSource = ds.cloneWithRows(responseJson);
            this.setState(appState);

        }).catch((error) => {
            console.error(error);
        });

    });

  }
  render() {
    return (
        <View style={{flex: 1}}>
            <View style={[{flex: 1, flexDirection: 'row'}, styles.toolbar]}>
            </View>
          <View style={[{flex: 2, flexDirection: 'row'}, styles.top_bar]}>
            <View style={[{flex: 1}]} >
                <Text style={styles.top_bar_text}>{this.state.profile.name}</Text>
                <Text>{this.state.profile.email}</Text>
            </View>
            <View style={styles.qrcode_container}>
                <Text>QRCODE</Text>
            </View>

          </View>
          <View style={[{flex: 3}, styles.assets_container]}>
            <ListView dataSource={this.state.dataSource} renderRow={(rowData) =>
                <View style={[{flex: 1, flexDirection: 'row'}, styles.assets_item]}>
                    <View>
                        <Text style={styles.assets_item_quant}>{rowData.balance}</Text>
                    </View>
                    <View>
                        <Text style={styles.assets_item_text}>{rowData.asset}</Text>
                    </View>
                </View>
            } />
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    toolbar: {
        height: 20,
        backgroundColor: '#DDDDDD'
    },

    top_bar: {
        height: 48,
        backgroundColor: '#EEEEEE'
    },
    qrcode_container: {
            height: 100,
            width: 100,
            backgroundColor: '#999999'
    },
    top_bar_text: {
        fontSize: 20,
        color: "#e67448"
    },
    assets_container: {
        backgroundColor: '#EEEEEE'
    },
    assets_item: {
        backgroundColor: '#CCCCFE'
    },
    assets_item_quant: {
        fontSize: 24,
        textAlign: 'center',
        margin: 10
    },
    assets_item_text: {
        fontSize: 14,
        textAlign: 'center',
        margin: 10
    },
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
