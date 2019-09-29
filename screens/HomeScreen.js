import React from 'react';
import {
  Alert,
  AsyncStorage,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Ionicons  from 'react-native-vector-icons/Ionicons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';
import strings from "../config/strings";
import constants from "../config/constants";
import Button from "../components/Button";
import VideoList from "../components/VideoList";
import { MonoText } from '../components/StyledText';

const IoniconsHeaderButton = passMeFurther => (
  // the `passMeFurther` variable here contains props from <Item .../> as well as <HeaderButtons ... />
  // and it is important to pass those props to `HeaderButton`
  // then you may add some information like icon size or color (if you use icons)
  <HeaderButton {...passMeFurther} IconComponent={Ionicons} iconSize={23} color="white" />
);

class LogoTitle extends React.Component {
  render() {
    return (
      <Image
        source={require('../assets/images/app_icon.png')}
        style={{ width: 30, height: 30, marginLeft: 4 }}
      />
    );
  }
}


export default class HomeScreen extends React.Component {
  state = {
    videos: null,
    refreshing: false,
  }

  static navigationOptions = ({ navigation }) => {
    const userToken = navigation.getParam('user_token', 'None');
    const username = navigation.getParam('username', 'Anonymous');
    const logInOut = userToken != 'None' ? <Item title={username} onPress={navigation.getParam('logout')} /> :
<Item title=' Log In' onPress={navigation.getParam('login')} />;
    return {
      headerLeft: <LogoTitle/>,
      // headerTitleStyle: { alignSelf: 'flex-start', flexDirection: 'row', flex: 1},
      headerRight: (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item title="search" iconName="ios-search" onPress={() => navigation.navigate('Search')} />
          {logInOut}
        </HeaderButtons>
      ),
    };
  };

  componentDidMount() {
    this._loadInitialState().done();
  }
  async _loadInitialState() {
    this.props.navigation.setParams({ logout: this._logoutAlert });
    this.props.navigation.setParams({ login: this._handleLogin });
    const userId = this.props.navigation.getParam('user_id');
    const requestId = userId === null || userId === undefined ? '0' : userId;
    // console.log("UserId: ", requestId);
    try {
      token = await AsyncStorage.getItem('user_token');
      results = await fetch(strings.HOST + "/users/" + requestId + "/recommend/" + constants.TOP_K_RECOMMENDATIONS, {
                  method: 'GET',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                  },
                });
      results = await results.json({'status':'OK'});
      this.setState({videos:results});
    } catch (error) {
      console.log(error);
    }
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this._loadInitialState().done();
    this.setState({refreshing: false});
 }

  render() {
    if (this.state.videos === null) {
      return (
        <View style={styles.container}>
          <Text> "Loading" </Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
            />
          }>
        <Text style={styles.optionsTitleText}>
          Recommended for you
        </Text>
          <VideoList
            videos = {this.state.videos}
            screen = {this}
          />
        </ScrollView>
      </View>
    );
  }

  _logoutAlert = () => {
    Alert.alert(
  'Do you want to log out?',
  '',
  [
    {
      text: 'No',
      style: 'cancel',
    },
    {text: 'Yes', onPress: () => this._handleLogout()},
  ],
  {cancelable: false},
);
  }

  _handleLogout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  _handleLogin = async () => {
    this.props.navigation.navigate('Auth');
  };
}

const styles = StyleSheet.create({
  search: {
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoutContainer: {
    marginTop: 15,
    alignItems: 'center',
    width: 100,
  },
  optionsTitleText: {
    fontSize: 16,
    marginTop: 6,
    marginBottom: 6,
    textAlign: "center",
    fontWeight: 'bold',
  },
});
