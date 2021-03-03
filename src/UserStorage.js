import React from 'react';
import {
  ScrollView,
  ActivityIndicator,
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SaveModal from './SaveModal';
import {MyContext} from './cameraComponent';
import axios from 'axios';

class UserStorage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userImages: [],
    };
    this.getData = this.getData.bind(this);
    this.navigator = props.navigation.addListener('focus', this.AsyncData);
  }
  AsyncData = async () => {
    this.setState({loading: true});
    setTimeout(async () => {
      await this.getData();
    }, 5000);
  };

  getData = async () => {
    console.log('Read data');
    try {
      const {userKey} = this.props;
      const images = await AsyncStorage.getItem('@' + userKey);
      // console.log('get Data', images);
      if (images !== null) {
        this.setState({userImages: JSON.parse(images)});
        // value previously stored
      }
      this.setState({loading: false});
    } catch (e) {
      // error reading value
    }
  };

  render() {
    //console.log(this.state.userImages);
    // eslint-disable-next-line react-hooks/rules-of-hooks

    console.log(this.props);
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: StatusBar.currentHeight || 0,
        }}>
        {this.state.loading === true ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <FlatList
            data={this.state.userImages}
            renderItem={StorageItem}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </SafeAreaView>
    );
  }
}

const StorageItem = ({item, separators}) => {
  console.log(item.timeStamp);
  const base64Icon = 'data:image/png;base64,' + item.image;
  let token;

  const upLoad = async (filename) => {
    const data = {
      filename: filename,
      image64: item.image,
    };
    await axios({
      method: 'post',
      url: 'http://192.168.0.107:8080/drive/base64/image/upload',
      data,
      headers: {Authorization: token.accessToken, withCredentials: true},
    })
      .then((res) => {
        Alert.alert('Success');
      })

      .catch((e) => console.log(e));
  };
  return (
    <View
      style={{
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: 'red',
      }}>
      <Image
        style={{
          width: 200,
          height: 200,

          alignItems: 'center',
        }}
        source={{uri: base64Icon}}
      />
      <View>
        <Text>Lat: {item.lat}</Text>
        <Text>Long: {item.long}</Text>
        <Text>TimeStamp: {item.timeStamp}</Text>
        <Text>Description: {item.description}</Text>
        <SaveModal
          typeText="Google Drive"
          iconType="cloud-upload-outline"
          uploadFunc={upLoad}
        />
      </View>
    </View>
  );
};
export default UserStorage;
