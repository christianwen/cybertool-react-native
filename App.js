import React from 'react';
import AttackScreen from '@screens/AttackScreen';
import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify from '@aws-amplify/core';
import { Auth } from 'aws-amplify';
import config from './aws-exports';
import { Root } from 'native-base';

Amplify.configure(config);

class App extends React.Component {
  constructor(props){
    super(props);
  }
  
  async componentDidMount(){
    const { attributes, username } = await Auth.currentAuthenticatedUser();
  }

  render(){
    return (
      <Root>
        <AttackScreen />
      </Root>
    )
  }
}

export default withAuthenticator(App);