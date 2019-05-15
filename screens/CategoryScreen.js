import React from 'react';
import {
  AsyncStorage,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

import strings from "../config/strings";
import VideoList from "../components/VideoList";

export default class CategoryScreen extends React.Component {
  state = {
    videos: [],
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('title', 'Video details')
    };
  };

  componentDidMount() {
    this._loadInitialState().done();
  }

  async _loadInitialState() {
    try {
      const category = this.props.navigation.getParam('category')
      results = await fetch(strings.HOST + "/categories/" + category.category_id + "/videos", {
                  method: 'GET',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                });
      results = await results.json();
      this.setState({videos:results})
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
        <ScrollView style={styles.container}>
          <VideoList
            videos = {this.state.videos}
            screen = {this}
          />
        </ScrollView>
    );
  }

  _handleVideoClick = (video) => {
    this.props.navigation.push('Video', {title: video.title, video : video});
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
