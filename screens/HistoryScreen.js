import React from 'react';
import {
  AsyncStorage,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

import strings from "../config/strings";

export default class HistoryScreen extends React.Component {
  state = {
    videos: [],
    refreshing: false,
  }

  static navigationOptions = {
    title: 'History',
  };

  componentDidMount() {
    this._loadInitialState().done();
  }

  async _loadInitialState() {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      if (user_id !== null){
        results = await fetch(strings.HOST + "/users/" + user_id + "/history", {
                method: 'GET',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
            });
        results = await results.json();
        this.setState({videos:results})
      }
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
    const videos = this.state.videos;
    const videoViews = videos.map((video) =>
    <View style={styles.videoRow} key={video.youtube_id}>
      <TouchableOpacity onPress={() =>this._handleVideoClick(video)} style={styles.videoRow}>
        <Image
          source={{uri: 'https://img.youtube.com/vi/' + video.youtube_id + '/0.jpg'}}
          style={styles.videoImage}
        />
        <Text style={styles.videoTitleText}>{video.title}</Text>
      </TouchableOpacity>
    </View>
    );
    return (
        <ScrollView style={styles.container} refreshControl={
          <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
          />
        }>
          <View style={styles.videos}>
            {videoViews}
          </View>
        </ScrollView>
    );
  }

  _handleVideoClick = (video) => {
    this.props.navigation.push('Video', {title: video.title, video : video});
  };
}

const styles = StyleSheet.create({
  videoRow: {
    marginTop: 10,
    marginLeft: 12,
    flex: 1,
    flexDirection: 'row',
  },
  videoImage: {
    height: 80,
    flex: 0.5
  },
  videoTitleText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
    flex: 0.5,
  },
  videos: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
