import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Alert,
} from 'react-native';

var API_ENDPOINT = 'http://192.168.1.125:9091/transaction';

var TransactionView = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>

      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#15204C',
  }
});

module.exports = TransactionView;
