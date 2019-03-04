import React from 'react';
import {
  AsyncStorage,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import { Header } from 'react-native-elements'
import Button from "../components/Button";
import VideoList from "../components/VideoList";
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const videos = [
      {
        video_id : 'lCnxMZkCIVc',
        description : 'Video 1'
      },
      {
        video_id : 'AO4snCT8SN4',
        description : 'Video 2'
      },
      {
        video_id : 'UrhqmMRv1gQ',
        description : 'Video 3'
      },
      {
        video_id : 'mk1DXwb-XbM',
        description : 'Video 4'
      },
    ]
    return (
      <View style={styles.container}>
      <Header
  leftComponent={{ icon: 'menu', color: '#fff', onPress: () => alert('ea') }}
  centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
  rightComponent={{ icon: 'search', color: '#fff' }}
/>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <VideoList
            videos = {videos}
          />
          <View style={styles.logoutContainer}>
            <Button
              label="LOG OUT"
              onPress={this._handleLogout}
              />
          </View>
        </ScrollView>
      </View>
    );
  }

  _handleLogout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  _handleHelpPress = (text) => {
  const url = 'https://www.youtube.com/embed/'+ text + '?rel=0&autoplay=0&showinfo=0&controls=0';
  console.log(url);
    WebBrowser.openBrowserAsync(url);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: -20,
    marginLeft:20,
  },
  logoutContainer: {
    marginTop: 15,
    alignItems: 'center',
    width: 100,
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
