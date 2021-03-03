import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import b64toBlob from 'b64-to-blob';

import {MyContext} from './cameraComponent';
import {base64StringToBlob} from 'blob-util';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SaveModal from './SaveModal';
import axios from 'axios';
export default class ImagePreviewScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.context = MyContext;
  }
  async componentDidMount() {
    const {image, timeStamp} = this.props.route.params;
    const {loading} = this.state;

    const base64Icon = 'data:image/png;base64,' + image.base64;
    const contentType = 'image/png';
    const blob = b64toBlob(image.base64, contentType);
    console.log('Blob', blob.size);
    console.log('Context', this.access);
    // await this.getData();
  }
  uploadDrive = async (filename) => {
    const {image, timeStamp} = this.props.route.params;
    const data = {
      filename: filename,
      image64: image.base64,
    };
    await axios({
      method: 'post',
      url: 'http://192.168.0.107:8080/drive/base64/image/upload',
      data,
      headers: {Authorization: this.access.accessToken, withCredentials: true},
    })
      .then((res) => {
        //this.props.navigation.navigate('Storage')
      })

      .catch((e) => console.log(e));
  };
  saveLocal = async (desc) => {
    const {image, timeStamp} = this.props.route.params;

    const objectSave = {
      lat: this.lat,
      long: this.long,
      image: image.base64,
      timeStamp: timeStamp,
      description: desc,
    };
    console.log('Time', this.lat);
    try {
      const jsonValue = await AsyncStorage.getItem('@' + this.email);

      let storedImages = jsonValue != null ? JSON.parse(jsonValue) : [];
      //jsonValue.push(objectSave);
      storedImages.push(objectSave);
      await AsyncStorage.setItem(
        '@' + this.email,
        JSON.stringify(storedImages),
      );
     // this.props.navigation.navigate('Storage')
    } catch (e) {
      console.log(e);
    }
  };
  Loading = (<ActivityIndicator size="large" color="#00ff00" />);

  render() {
    const {image, timeStamp} = this.props.route.params;
    const {loading} = this.state;
    const base64Icon = 'data:image/png;base64,' + image.base64;

    return (
      <MyContext.Consumer style={{}}>
        {(value) => {
          console.log(value);
          this.access = value.tokens;
          this.lat = value.latitude;
          this.long = value.longitude;
          this.email = value.userInfo.user.email;
          //console.log(value);
          if (loading) {
            return <Loading />;
          } else {
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: 'red',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                  source={{uri: base64Icon}}
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}>
                  <View
                    style={{
                      flex: 0,
                      flexDirection: 'row',
                      //backgroundColor: '#fff',
                      justifyContent: 'space-between',
                    }}>
                    <SaveModal
                      typeText="Google Drive"
                      iconType="cloud-upload-outline"
                      uploadFunc={this.uploadDrive}
                    />
                    <SaveModal
                      typeText="Save Locally"
                      iconType="save-outline"
                      uploadFunc={this.saveLocal}
                    />
                  </View>
                </View>
              </View>
            );
          }
        }}
      </MyContext.Consumer>
    );
  }
}
