
import React from 'react';
import { Header, Title, Body, Container, Content, List, ListItem, Text, Right, Button, Left } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons'

import styles from './styles';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import moment from 'moment';

const ENDPOINT = 'https://hack.christianwen.com'

class HistoryScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history: []
    }
    this.loadHistory = this.loadHistory.bind(this);
  }

  async loadHistory(){
    const currentSession = await Auth.currentSession();
    const { idToken: { jwtToken, payload: { sub } } } = currentSession;
    const username = sub;
    //const { username } = this.props.screenProps;
    console.log(username);
    const { data } = await axios.get(`${ENDPOINT}/history?username=${username}`);
    this.setState(prevState => ({
      ...prevState,
      history: data.data.history || []
    }))
    console.log(data.data.history)
  }

  async componentWillMount(){
    await this.loadHistory();
  }
  
  render() {
    return (
      <Container>
        <Header>
          <Left>

          </Left>
          <Body>
            <Title>History</Title>
          </Body>
          <Right>
            <Button 
              transparent
              onPress={this.loadHistory}
            >
              <MaterialCommunityIcons name={'reload'} size={25}/>
            </Button>
          </Right>
        </Header>
        <Content>
          {!(this.state.history && this.state.history.length) && 
          <Text>No attacks found.</Text>
          }
          <List 
            dataArray={this.state.history}
            renderRow={item => (
              <ListItem>
                
                <Body>
                  <Text>{getConciseURL(item.target)}</Text>
                  {/*item.created_at &&
                  <Text note>{moment(item.created_at).format('h:mm')}</Text>*/
                  }  
                </Body>
                <Right>
                  <Text note>{item.duration}s  {item.strength}⚡</Text>
                </Right>
              </ListItem>
            )}
            />
        </Content>
      </Container>
    )
  }
}

export default HistoryScreen;

function getConciseURL(url){
  url = url.replace('http://','');
  url = url.replace('https://','');
  return url;
}


        