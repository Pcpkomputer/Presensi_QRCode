import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';
import {createStackNavigator,createAppContainer, createSwitchNavigator} from 'react-navigation';

export default class Login extends React.Component {

    static navigationOptions={
      header:null
    }
    constructor(props){
      super(props);
      this.state={
        username:'',
        password:'',
        text:'123'
      }
      this.loginHandler=this.loginHandler.bind(this);
      this.props.navigation.navigate.bind(this);
    }
  
  
    loginHandler=(navigate)=>{
      if(this.state.username.length===0 || this.state.password.length===0){
        alert("masukkan data");
      }
      else{
        let xml=new XMLHttpRequest();
        xml.onload=function(res){
          let data=JSON.parse(res.currentTarget.response);
          data['navigator']=navigate;
          if(data.status==='error'){
            alert('Login gagal!');
          }
          if(data.status==='success'){
            navigate('Dashboard',data);
          }
        }
        xml.open('POST','http://192.168.1.65:8080/login',true);
        xml.setRequestHeader('content-type','application/json');
        xml.send(JSON.stringify({
          nim:this.state.username,
          password:this.state.password
        }));
      }
    }
  
    render(){
      return(
        <View style={{display:'flex',flex:1,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <View style={{padding:20,width:Dimensions.get('screen').width}}>
            
            <View style={{borderWidth:1,padding:15}}>
                <View style={{alignSelf:'center',}}><Text>Login Page</Text></View>
            </View>
              <View style={{marginTop:10}}><TextInput onChangeText={(res)=>{
                this.setState({username:res});
              }} style={{borderBottomWidth:1}} placeholder="Username" /></View>
              <View><TextInput onChangeText={
                (res)=>{
                  this.setState({password:res});
                }
              } secureTextEntry={true} style={{borderBottomWidth:1}} placeholder="Password" /></View>
              <View style={{marginTop:20}}><Button onPress={
                ()=>{
                  var {navigate}=this.props.navigation;
                  this.loginHandler(navigate);
                }
              } title="Login"></Button></View>
            </View>
            
            
    
        </View>
      )
    }
  }