import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';
import {createStackNavigator,createAppContainer, createSwitchNavigator} from 'react-navigation';

export default class StatusScreen extends React.Component {
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.props.navigation.navigate("Dashboard");
    }
    render(){
        return (
            <View style={{display:'flex',flex:1,alignItems:'center',justifyContent:'center'}}> 
                <Text style={{fontSize:30}}>{this.props.navigation.getParam('msg')}</Text>
            </View>
        )
    }
}