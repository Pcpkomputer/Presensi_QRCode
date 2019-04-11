import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';
import {createStackNavigator,createAppContainer} from 'react-navigation';
import { BarCodeScanner, Permissions } from 'expo';

export default class CameraScreen extends React.Component {
    static navigationOptions={
        title:'Scan QR Code'
    }

    

    state = {
        hasCameraPermission: null,
      }

    constructor(props){
        super(props);
        this.socket=this.props.navigation.getParam('socket');
        this.user={
            nim:this.props.navigation.getParam('NIM'),
            nama:this.props.navigation.getParam('Nama'),
            jenjang:this.props.navigation.getParam('Jenjang'),
            prodi:this.props.navigation.getParam('Prodi')
        }
        this.handleBarCodeScanned=this.handleBarCodeScanned.bind(this);
    }


    handleBarCodeScanned = ({ type, data }) => {
        this.socket.send(JSON.stringify({
            xhrType:'scannedQRfromMobile',
            qrCode:data,
            user:this.user
        })
    )}



    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
        }


    render(){
        const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return (
        <View style={{display:'flex',flex:1,alignItems:'center',justifyContent:'center'}}><Text>Meminta perijinan kamera...</Text></View>
      )
    }
    if (hasCameraPermission === false) {
      return (
        <View style={{display:'flex',flex:1,alignItems:'center',justifyContent:'center'}}><Text>Tidak ada perijinan kamera...</Text></View>
      )
    }
    return (
      <View style={{ flex: 1,backgroundColor:'red'}}>
        <BarCodeScanner
          onBarCodeScanned={this.handleBarCodeScanned}
          style={StyleSheet.absoluteFill}
        />

      </View>)
    }
}