import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {MyContext} from './cameraComponent';

export default class CameraScreen extends Component {
  constructor(props) {
    super(props);
  }
  takePicture = async () => {

    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      const timeStamp=new Date();
      console.log('PICTURE',);
     // this.props.navigation.navigate('Image preview').setParams({image: 1});
      this.props.navigation.navigate('Image preview',{image:data,timeStamp:timeStamp.toString()})
    }
  };
  render() {
    console.log(this.props);
    return (

      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}>
          <View
            style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity style={styles.capture} onPress={this.takePicture}>
              <Text>CAmera</Text>
            </TouchableOpacity>
          </View>
        </RNCamera>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
