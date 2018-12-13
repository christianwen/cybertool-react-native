
import React from 'react';
import { View } from 'react-native';

import styles from './styles';
import axios from 'axios';

const ENDPOINT = 'https://hack.christianwen.com'

class HistoryScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history: []
    }
  }

  async componentWillMount(){
    const { username } = this.props.screenProps;
    const result = await axios.get(`${ENDPOINT}/history?username=${username}`)
    this.setState(prevState => ({
      ...prevState,
      history: result.data.history
    }))
  }
  
  render() {
    return (
      <View>
        
      </View>
    )
  }
}

export default HistoryScreen;