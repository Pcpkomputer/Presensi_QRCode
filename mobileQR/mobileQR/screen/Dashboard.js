import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';
import {createStackNavigator,createAppContainer} from 'react-navigation';

export default class DashboardScreen extends React.Component {

    static navigationOptions={
        header:null,
    }

    constructor(props){
        super(props);
        this.state={
            NIM:this.props.navigation.getParam('NIM'),
            Nama:this.props.navigation.getParam('Nama'),
            Jenjang:this.props.navigation.getParam('Jenjang'),
            Prodi:this.props.navigation.getParam('Prodi'),
            Token:this.props.navigation.getParam('token'),
        };
        this.socket=null
        
       
    }

    async componentDidMount(){
        var berpindah=this.props.navigation.getParam('navigator');
        this.socket=new WebSocket(`ws://192.168.1.65:8080?token=${this.props.navigation.getParam('token')}&nim=${this.props.navigation.getParam('NIM')}&type=mobile`)
        this.socket.onopen=function(){
            console.log('connected');
        }
        this.socket.onclose=function(){
           // this.props.navigation.navigate('Auth');
        }    

        this.socket.onmessage=function(res){
            let parsed=JSON.parse(res.data);
            if(parsed.xhrType==='toStatusScreen'){
                berpindah("Status",{msg:parsed.params});
            }
        }

    
    }


    render(){
        return (
            <View style={{display:'flex',flex:1,alignItems:'center'}}>
                <View style={{marginTop:50}}><Text>Welcome to dashboard!</Text></View>
                <View><Text>{this.props.navigation.getParam('NIM')}</Text></View>
                <View style={{marginTop:5}}><Button title="Scan QR" onPress={()=>{
                    this.props.navigation.navigate('Camera',{socket:this.socket,
                        NIM:this.props.navigation.getParam('NIM'),
                        Nama:this.props.navigation.getParam('Nama'),
                        Jenjang:this.props.navigation.getParam('Jenjang'),
                        Prodi:this.props.navigation.getParam('Prodi'),
                        Token:this.props.navigation.getParam('token')
                    });
                }}></Button></View>
                <View style={{marginTop:5}}>
                    <Button title="Input Manual" onPress={
                        ()=>{
                            this.props.navigation.navigate('Manual',{socket:this.socket,
                                NIM:this.props.navigation.getParam('NIM'),
                                Nama:this.props.navigation.getParam('Nama'),
                                Jenjang:this.props.navigation.getParam('Jenjang'),
                                Prodi:this.props.navigation.getParam('Prodi'),
                                Token:this.props.navigation.getParam('token')
                            });
                        }
                    }></Button>
                </View>
            </View>
        )
    }
}