import React from 'react';

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { WebBrowser } from 'expo';

class VideoList extends React.Component {
  render() {
    const { videos, screen } = this.props;
    const videoViews = videos.map((video) =>
    <View style={styles.container} key={video.youtube_id}>
      <TouchableOpacity onPress={() =>this._handleHelpPress(screen, video)} style={styles.helpLink}>
        <Image
          source={{uri: 'https://img.youtube.com/vi/' + video.youtube_id + '/0.jpg'}}
          style={styles.videoImage}
        />
        <Text style={styles.videoTitleText}>{video.title}</Text>
      </TouchableOpacity>
    </View>
  );
    return (
      <View>
      {videoViews}
    </View>
  );
  }

  _handleHelpPress = (screen, video) => {
    screen.props.navigation.push('Video', {title: video.title, video : video});
    // screen.props.navigation.push('Video', {title: "Video again", video : video});
  };
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20,
    marginLeft:20,
    marginRight: 20
  },
  videoImage: {
    height: 160,
    flex : 1,
  },
  videoTitleText: {
    fontSize: 20,
    color: '#2e78b7',
    marginTop: 5,
  },
});

export default VideoList;
