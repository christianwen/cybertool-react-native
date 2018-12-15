// Native modules
import React from 'react';
import { Keyboard } from 'react-native';

// Third party modules
import { Container, Body, Header, Title, Content, Card, CardItem, Form, Text, Input, Item, Button } from 'native-base';
import axios from 'axios';

// Custom modules
import NetworkConfig from '@configs/network';
import styles from './styles';

class QuotaScreen extends React.Component{

  constructor(props){
    super(props);
    this.getFreeQuota = this.getFreeQuota.bind(this);
    this.getQuotaFromPromotionCode = this.getQuotaFromPromotionCode.bind(this);
    this.state = {
      promo_code: ''
    }
  }

  getFreeQuota(){
    axios.get(`${NetworkConfig.ENDPOINT}/quota?username=${this.props.screenProps.username}&type=get_free_quota`)
      .then(({data}) => {
        if(data.success){
          alert('Reset free quota to 600 seconds');
          this.props.screenProps.resetQuotaFromCache({ free_quota: 600 })
        } else alert(data.error);
      }).catch(error => console.log(error))
  }

  async getQuotaFromPromotionCode(){
    Keyboard.dismiss();
    const promo_code = this.state.promo_code;
    const { data } = await axios.get(`${NetworkConfig.ENDPOINT}/quota?username=${this.props.screenProps.username}&type=get_quota_from_promo_code&promo_code=${promo_code}`)
    if(data.success){
      const paid_quota = parseInt(data.data.paid_quota);
      this.props.screenProps.resetQuotaFromCache({ paid_quota })
      alert('Get quota successfully');
    } else alert(data.error);
  }

  onChangeText = key => text => {
    this.setState(prevState => ({
      ...prevState,
      [key]: text
    }));
  }

  render(){
    const { quota: { free_quota, paid_quota } } = this.props.screenProps;
    return (
      <Container>
        <Header>
          <Body>
            <Title>Quota</Title>
          </Body>
        </Header>

        <Content padder>
          <Card>
            <CardItem bordered>
              <Text style={styles.cardTitle}>Free quota: {free_quota}</Text>
            </CardItem>
            <CardItem>
              <Text>You have 600 seconds of free quota for testing purpose every month. If you wish to get more quota, you may contact Christian Wen to get a promotion code for use below.</Text>
            </CardItem>
            <CardItem bordered>
              <Button transparent info onPress={this.getFreeQuota}>
                <Text> Get my free quota </Text>
              </Button>
            </CardItem>
          </Card>
          <Card>
            <CardItem bordered>
              <Text style={styles.cardTitle}>Paid quota: {paid_quota}</Text>
            </CardItem>
            <CardItem>
              <Text style={styles.cardTitle}>Use promotion code</Text>
            </CardItem>
            
            <Form>
              <Item>
                <Input
                  placeholder={"Promotion code"}
                  placeholderTextColor={'#bdbdbd'}
                  onChangeText={this.onChangeText('promo_code')}
                />
                {this.state.promo_code.length!=0 && (
                  <Button transparent info onPress={this.getQuotaFromPromotionCode}>
                    <Text>Apply</Text>
                  </Button>
                )
              }
              </Item>
            </Form>
            <CardItem>
              <Text>The quota you get will vary according to the value of the promotion code you enter.</Text>
            </CardItem>
          </Card>
        </Content>
      </Container>
    )
  }
}

export default QuotaScreen;