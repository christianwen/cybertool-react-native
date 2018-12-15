import React from 'react';
import AttackScreen from '@screens/AttackScreen';
import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify from '@aws-amplify/core';
import { Auth } from 'aws-amplify';
import config from './aws-exports';
import { Root } from 'native-base';
import BottomNavigator from '@navigators/BottomNavigator';
import NetworkConfig from '@configs/network';
import axios from 'axios';

Amplify.configure(config);

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      quota: {
        free_quota: 0,
        paid_quota: 0
      },
      used_quota: 0
    }
    this.resetQuota = this.resetQuota.bind(this);
    this.resetQuotaFromCache = this.resetQuotaFromCache.bind(this);
  }
  
  async componentDidMount(){
    const { attributes, username } = await Auth.currentAuthenticatedUser();
    await this.setState({ username });
    this.resetQuota();
  }

  resetQuotaFromCache(newQuota){
    this.setState(prevState => ({
      ...prevState,
      quota: {
        paid_quota: newQuota.paid_quota || prevState.quota.paid_quota,
        free_quota: newQuota.free_quota || prevState.quota.free_quota
      }
    }))
  }

  async resetQuota(){
    const { data } = await axios.get(`${NetworkConfig.ENDPOINT}/quota?username=${this.state.username}`);
    await this.setState(prevState => ({
      ...prevState,
      quota: data
    }))
  }

  render(){
    const screenProps = {
      username: this.state.username,
      quota: this.state.quota,
      resetQuota: this.resetQuota,
      resetQuotaFromCache: this.resetQuotaFromCache
    }
    return (
      <Root>
        {/*<AttackScreen />*/}
        <BottomNavigator screenProps = {screenProps}/>
      </Root>
    )
  }
}

export default withAuthenticator(App);