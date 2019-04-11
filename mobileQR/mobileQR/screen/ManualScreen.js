import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';
import {createStackNavigator,createAppContainer} from 'react-navigation';
import { BarCodeScanner, Permissions } from 'expo';

export default class ManualScreen extends React.Component {
    static navigationOptions={
        title:'Presensi Manual'
    }

    state={
        queryQR:''
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
        this.manualHandler=this.manualHandler.bind(this);
    }

    manualHandler=(navigate)=>{
        this.socket.send(JSON.stringify({
            xhrType:'scannedQRfromMobile',
            qrCode:this.state.queryQR,
            user:this.user
        })
    )}

    componentDidMount(){
     
    }

    render(){
        return (
            <View style={{display:'flex',flex:1,padding:10}}>
                <View style={{padding:10,borderWidth:1}}>
                    <TextInput placeholder="Kode QR" onChangeText={(text)=>{
                        this.setState({queryQR:text})
                    }}></TextInput>
                </View>
                <View style={{marginTop:10}}>
                    <Button title="Proses" onPress={
                        ()=>{
                            var {navigate}=this.props.navigation;
                            this.manualHandler(navigate);
                        }
                    }></Button>
                </View>
            </View>
        )
    }

}