import React from 'react';
import {MyContext} from './cameraComponent';
import UserStorage from './UserStorage';

class StorageScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidAppear() {
    console.log('APPEAR');
  }
  componentDidMount() {
    console.log('MOUNT');
  }

  render() {
    return (
      <MyContext.Consumer>
        {(context) => {
          return (
            <UserStorage
              {...this.props}
              userKey={context.userInfo.user.email}
            />
          );
        }}
      </MyContext.Consumer>
    );
  }
}

export default StorageScreen;
