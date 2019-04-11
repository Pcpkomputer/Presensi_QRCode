import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button, AppRegistry } from 'react-native';
import {createStackNavigator,createAppContainer,createSwitchNavigator} from 'react-navigation';
import DashboardScreen from './screen/Dashboard';
import Login from './screen/Login';
import CameraScreen from './screen/CameraScreen';
import ManualScreen from './screen/ManualScreen';
import StatusScreen from './screen/StatusScreen';

export default class App extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
        <Containers/>
    );
  }
}


const AuthScreen=createStackNavigator({
  Auth:Login
})

const AppNavigator = createStackNavigator(
  {
    Dashboard: DashboardScreen,
    Camera:CameraScreen,
    Manual:ManualScreen,
    Status:StatusScreen
  }
);

const SwitchNav=createSwitchNavigator({
  Auth:AuthScreen,
  UserScreen:AppNavigator
})

const Containers=createAppContainer(SwitchNav);






