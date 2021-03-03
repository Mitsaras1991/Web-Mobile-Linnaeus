/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import {WebId} from '@env';
import {
  SafeAreaView,
  StyleSheet,
  Button,
  ScrollView,
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import CameraComponent, {MyContext} from './src/cameraComponent';
import Map from './src/map';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import axios from 'axios';
import Profile from './src/Profile';
import Geolocation from '@react-native-community/geolocation';
import StorageScreen from './src/StorageScreen';
const Tab = createBottomTabNavigator();
import {decode, encode} from 'base-64';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pushData: [],
      loggedIn: false,
    };
  }
  async componentDidMount() {
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/drive.install',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/docs',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.metadata',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/drive.photos.readonly',
        'https://www.googleapis.com/auth/gmail.readonly',
      ],
      webClientId:
        WebId,
      offlineAccess: true,
    });
    await this.getCurrentUserInfo();
    await this.requestLocationPermission();
  }
  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool Image App Location Permission',
          message: 'Cool Photo App needs access to your location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await Geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 30000, maximumAge: 1000},
        );
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      console.log(userInfo.scopes);
      // console.log(tokens.idToken);
      const data = {
        idToken: userInfo.idToken,
      };
      console.log(data);
      axios
        .post('http://192.168.0.107:8080/singin', data, {
          withCredentials: true,
        })
        .then((r) => {
          //console.log(r);
          this.setState({userInfo: userInfo, loggedIn: true, tokens});
        });

      // this.setState({userInfo: userInfo, loggedIn: true, tokens});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('cancel', error); // operation (f.e. sign in) is in progress already

        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('pro', error); // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('serv', error); // operation (f.e. sign in) is in progress already
      } else {
        // some other error happened
        console.log('else', error.code);
      }
    }
  };

  getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      const tokens = await GoogleSignin.getTokens();
      const data = {
        idToken: userInfo.idToken,
      };
      console.log(data);
      axios
        .post('http://192.168.0.107:8080/singin', data, {
          withCredentials: true,
        })
        .then((r) => {
          //console.log(r);
          this.setState({userInfo: userInfo, loggedIn: true, tokens});
        });
      // console.log(userInfo.accessToken);
      //this.setState({userInfo: userInfo, loggedIn: true, tokens});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
        this.setState({loggedIn: false});
      } else {
        // some other error
        this.setState({loggedIn: false});
      }
    }
  };

  signOut = async () => {
    try {
      console.log('Sign out');
      /*  const data = {
        idToken: this.state.userInfo.idToken,
      };
      console.log(this.state.userInfo.accessToken);
      axios({ method: 'get', url: 'http://192.168.0.107:8080/create',data,
        headers: { Authorization:  this.state.tokens.accessToken ,withCredentials:true} })*/
      /*axios
        .get('http://192.168.0.107:8080/create', data,
          {
            _headers:{Authorization: `Bearer  ${this.state.userInfo.accessToken}`}
          }
          //withCredentials: true,
        )*/
      /*.then((r) => {
          console.log(r);
        });*/
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({user: null, loggedIn: false}); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };
  render() {
    console.log(this.state.loggedIn);
    return (
      <>
        <View style={styles.container}>
          {!this.state.loggedIn && (
            <GoogleSigninButton
              style={{width: 192, height: 68}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={this._signIn}
            />
          )}
          {this.state.loggedIn && (
            <NavigationContainer>
              <MyContext.Provider value={this.state}>
                <Tab.Navigator
                  initialRouteName={'Camera'}
                  tabBarOptions={{
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'blue',
                    showLabel: true,
                    style: {height: 70},
                  }}>
                  <Tab.Screen
                    name="Profile"
                    {...this.state}
                    options={{
                      headerTitle: 'Profile',
                      tabBarIcon: (props) => (
                        <Icon
                          name="person-circle-outline"
                          size={30}
                          color={props.color}
                        />
                      ),
                    }}>
                    {(props) => (
                      <Profile
                        {...props}
                        signout={this.signOut}
                        userInfo={this.state.userInfo}
                      />
                    )}
                  </Tab.Screen>
                  <Tab.Screen
                    name="Location"
                    options={{
                      headerTitle: 'Location',
                      tabBarIcon: (props) => (
                        <Icon name="location" size={30} color={props.color} />
                      ),
                    }}>
                    {(props) => (
                      <Map
                        {...props}
                        latitude={this.state.latitude}
                        longitude={this.state.longitude}
                      />
                    )}
                  </Tab.Screen>
                  <Tab.Screen
                    name="Camera"
                    component={CameraComponent}
                    options={{
                      headerTitle: 'Camera',
                      tabBarIcon: (props) => (
                        <Icon name="camera" size={30} color={props.color} />
                      ),
                    }}
                  />
                  <Tab.Screen
                    name="Storage"
                    component={StorageScreen}
                    options={{
                      headerTitle: 'Storage',
                      tabBarIcon: (props) => (
                        <FontIcon name="hdd-o" size={30} color={props.color} />
                      ),
                    }}
                  />
                </Tab.Navigator>
              </MyContext.Provider>
            </NavigationContainer>
          )}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  container: {
    //marginTop: 22,
    //paddingHorizontal: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
