import React, {Component} from 'react';
import {
  Button,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class SaveModal extends Component {
  state = {
    modalVisible: false,
    desc: null,
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };
  changeText = (e) => {
    console.log(e.nativeEvent.text);
    this.setState({desc: e.nativeEvent.text});
  };
  render() {
    const {modalVisible} = this.state;
    return (
      <View style={styles.centeredView}>
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{this.props.typeText}</Text>
              <TextInput
                placeholder="FileName"
                value={this.state.desc}
                onChange={(text) => this.changeText(text)}
              />
              <TouchableHighlight
                style={{...styles.openButton, backgroundColor: '#2196F3'}}
                onPress={() => {
                  this.setModalVisible(false);
                  this.props.uploadFunc(this.state.desc);
                }}>
                <Text style={styles.textStyle}>Save</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  padding: 10,
                  backgroundColor: 'red',
                }}
                onPress={() => {
                  this.setModalVisible(false);
                }}>
                <Text style={styles.textStyle}>X</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          style={{
            backgroundColor: '#fff',
            borderRadius: 5,
            padding: 5,
            paddingHorizontal: 20,
            margin: 20,
          }}
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Icon
            style={{
              alignSelf: 'center',
            }}
            name={this.props.iconType}
            size={30}
          />
          <Text>{this.props.typeText}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default SaveModal;
