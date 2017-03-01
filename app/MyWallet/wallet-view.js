import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ListView,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode';

var WalletView = React.createClass({

    render: function() {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        dataSource = ds.cloneWithRows(['row1', 'row 2']);
        return (
            <View style={styles.container}>
                    <View style={styles.profilebar}>
                        <Image
                        style={styles.avatar}
                        source={{uri: this.props.profile.picture}}
                        />
                        <View>
                            <Text style={styles.title} >{this.props.profile.name}</Text>
                            <Text style={styles.title}>{this.props.profile.email}</Text>
                        </View>
                        <View style={styles.qrcode_container}>
                            <QRCode
                            value={this.props.profile.email}
                            size={100}
                            bgColor='purple'
                            fgColor='#EEEEEE'/>
                        </View>
                    </View>

                <TouchableHighlight
                style={styles.callApiButton}
                underlayColor='#949494'
                onPress={this._onCallApi}>
                    <Text>Call API</Text>
                </TouchableHighlight>

                <View style={[{flex: 6}, styles.assets_container]}>
                    <ListView dataSource={dataSource} renderRow={(rowData) => <Text>{rowData}</Text>} />
                </View>



            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#15204C',
    },
    messageBox: {
      flex: 1,
      justifyContent: 'center',
    },
    profilebar: {
        flex: 2,
        marginTop: 60,
        flexDirection: 'row'
    },
    badge: {
      alignSelf: 'center',
      height: 110,
      width: 102,
      marginBottom: 80,
    },
    avatar: {
      alignSelf: 'center',
      height: 40,
      width: 80,
    },
    title: {
      fontSize: 17,
      textAlign: 'center',
      marginTop: 20,
      color: '#FFFFFF',
    },
    callApiButton: {
      height: 50,
      alignSelf: 'stretch',
      backgroundColor: '#D9DADF',
      margin: 10,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
});

module.exports = WalletView;
