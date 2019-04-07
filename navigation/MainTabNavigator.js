import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import constants from '../config/constants';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import VideoScreen from '../screens/VideoScreen';
import CategoryListScreen from '../screens/CategoryListScreen';
import CategoryScreen from '../screens/CategoryScreen';
import HistoryScreen from '../screens/HistoryScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import colors from "../config/colors";

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Video: VideoScreen,
    Search: SearchScreen,
  },
  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.BLUE,
      },
      headerTintColor: colors.WHITE,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
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

const CategoryStack = createStackNavigator({
  CategoryList: CategoryListScreen,
  Category: CategoryScreen,
  Video: VideoScreen,
},
{
  initialRouteName: 'CategoryList',
  /* The header config from HomeScreen is now here */
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: colors.BLUE,
    },
    headerTintColor: colors.WHITE,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});

CategoryStack.navigationOptions = {
  tabBarLabel: 'Categories',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={constants.IS_IOS ? 'ios-list' : 'md-list'}
    />
  ),
};

const HistoryStack = createStackNavigator({
  History: HistoryScreen,
  Video: VideoScreen,
},
{
  initialRouteName: 'History',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: colors.BLUE,
    },
    headerTintColor: colors.WHITE,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});

HistoryStack.navigationOptions = {
  tabBarLabel: 'History',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={constants.IS_IOS ? 'ios-bookmark' : 'md-options'}
    />
  ),
};

const FavoritesStack = createStackNavigator({
  Favorite: FavoriteScreen,
  Video: VideoScreen,
},
{
  initialRouteName: 'Favorite',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: colors.BLUE,
    },
    headerTintColor: colors.WHITE,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});

FavoritesStack.navigationOptions = {
  tabBarLabel: 'Favorites',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-heart' : 'md-heart'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  CategoryStack,
  FavoritesStack,
  HistoryStack,
});
