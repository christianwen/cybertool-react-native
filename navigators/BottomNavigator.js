

import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { AttackScreen, HistoryScreen, QuotaScreen } from '@screens';

import { MaterialCommunityIcons } from '@expo/vector-icons';

const BottomNavigator = createBottomTabNavigator(
  {
    Attack: { screen: AttackScreen },
    Quota: { screen: QuotaScreen },
    History: { screen: HistoryScreen },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        switch (routeName){
          case 'Attack': 
            return <MaterialCommunityIcons name={'hammer'} size={25} color={tintColor} />
          case 'Quota': 
            return <MaterialCommunityIcons name={'battery'} size={25} color={tintColor} />
          case 'History': 
            return <MaterialCommunityIcons name={'history'} size={25} color={tintColor} />
          
        }
      }
    }),
    tabBarOptions: {
      activeTintColor: '#37474f',
      inactiveTintColor: '#9e9e9e',
    },
  }
)

const MainNavigator = createAppContainer(BottomNavigator);

export default MainNavigator;