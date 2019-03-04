import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import constants from '../config/constants';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name = {constants.IS_IOS ? 'ios-home': 'md-home'}
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Inbox',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={constants.IS_IOS ? 'ios-mail' : 'md-link'}
    />
  ),
};

const HistoryStack = createStackNavigator({
  Settings: SettingsScreen,
});

HistoryStack.navigationOptions = {
  tabBarLabel: 'In Progress',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={constants.IS_IOS ? 'ios-bookmark' : 'md-options'}
    />
  ),
};

const FavoritesStack = createStackNavigator({
  Settings: SettingsScreen,
});

FavoritesStack.navigationOptions = {
  tabBarLabel: 'Favorites',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-heart' : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  HistoryStack,
  FavoritesStack,
});
