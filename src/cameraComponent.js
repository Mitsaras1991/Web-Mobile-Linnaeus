import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import CameraScreen from './CameraScreen';
import ImagePreviewScreen from './ImagePreviewScreen';
import Profile from './Profile';
const Stack = createStackNavigator();
export const MyContext = React.createContext();
export default class CameraComponent extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    console.log('HHHHHH');
    return (
      <NavigationContainer independent={true}>

          <Stack.Navigator initialRouteName={'Camera Capture'}>
            {/* eslint-disable-next-line no-undef */}
            <Stack.Screen
                name="Camera Capture"
                component={CameraScreen}
                {...this.props}
            />
            <Stack.Screen name="Image preview" component={ImagePreviewScreen}>
            </Stack.Screen>
          </Stack.Navigator>


      </NavigationContainer>
      /*   */
    );
  }

  /*
  };*/
}
