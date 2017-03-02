/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    Alert,
    StyleSheet,
    Button,
    Text,
    View,
    ListView,
    Navigator,
    TouchableHighlight
} from 'react-native';

import WelcomeView from './welcome-view';
import WalletView from './wallet-view';
import TransactionView from './transaction-view';

var appState = {
    dataSource: []
}


class MyWallet extends Component {
    constructor(props) {
        super(props);


    }
    render() {
        return (
            <Navigator style={styles.navigator}
                initialRoute={{ name: "Welcome"}}
                renderScene= { this.renderScene }
                navigationBar={
                    <Navigator.NavigationBar
                    style={ styles.nav }
                    routeMapper={NavigationBarRouteMapper} />
                }
            />
        );
    }

    renderScene(route, navigator) {
        if (route.name == "Welcome") {
            return <WelcomeView navigator={navigator} {...route.passProps} />
        }
        if (route.name == "Wallet") {
            return <WalletView navigator={navigator} {...route.passProps} />
        }
        if (route.name == "Transaction") {
            return <TransactionView navigator={navigator} {...route.passProps} />
        }
    }
}

var NavigationBarRouteMapper = {
    LeftButton(route, navigator, index, navState) {
        if(index > 0) {
            return (
                <TouchableHighlight
                    underlayColor="transparent"
                    onPress={
                        () => {
                            if (index > 0) {
                                navigator.pop()
                            }
                        }
                    }>
                    <Text style={ styles.leftNavButtonText }>Back</Text>
                </TouchableHighlight>
            )
        }
        else {
            return null
        }
    },

    RightButton(route, navigator, index, navState) {
        return null
    },

    Title(route, navigator, index, navState) {
        return <Text style={ styles.title }>MyWallet</Text>
    }
};

const styles = StyleSheet.create({
    navigator: {
        flex: 1,
    },
    title: {
        marginTop:4,
        fontSize:24
    },
    leftNavButtonText: {
        fontSize: 18,
        marginLeft:13,
        marginTop:2
    },
    rightNavButtonText: {
        fontSize: 18,
        marginRight:13,
        marginTop:2
    },
    nav: {
        height: 60,
        backgroundColor: '#efefef'
    }
});









/*
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
//var serverUrl = 'http://10.40.8.125:9091';

const refreshAssets = () => { Alert.alert('Button has been pressed!'); };

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
                <Button onPress={refreshAssets} title="Refresh" color="#841584" accessibilityLabel="Learn more about this purple button" />
            </View>
          <View style={[{flex: 2, flexDirection: 'row'}, styles.top_bar]}>
            <View style={[{flex: 1}]} >
                <Text style={styles.top_bar_text}>{this.state.profile.name}</Text>
                <Text>{this.state.profile.email}</Text>
            </View>
            <View style={styles.qrcode_container}>
            <QRCode
              value={this.state.profile.email}
              size={100}
              bgColor='purple'
              fgColor='#EEEEEE'/>
            </View>

          </View>
          <View style={[{flex: 6}, styles.assets_container]}>
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
        height: 16,
        backgroundColor: '#FFBB33'
    },

    top_bar: {
        height: 48,
        backgroundColor: '#EEEEEE',
        margin: 10
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
        backgroundColor: '#EEEEEE',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    assets_item: {
        backgroundColor: 'purple'
    },
    assets_item_quant: {
        fontSize: 24,
        textAlign: 'center',
        margin: 10,
        color: "#EEEEEE"
    },
    assets_item_text: {
        fontSize: 14,
        textAlign: 'center',
        margin: 10,
        color: "#EEEEEE"
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
*/

AppRegistry.registerComponent('MyWallet', () => MyWallet);
