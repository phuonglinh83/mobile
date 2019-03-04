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
    const { videos } = this.props;
    const videoViews = videos.map((video) =>
    <View style={styles.container} key={video.video_id}>
      <TouchableOpacity onPress={() =>this._handleHelpPress(video.video_id)} style={styles.helpLink}>
        <Image
          source={{uri: 'https://img.youtube.com/vi/' + video.video_id + '/0.jpg'}}
          style={styles.videoImage}
        />
        <Text style={styles.videoTitleText}>{video.description}</Text>
      </TouchableOpacity>
    </View>
  );
    return (
      <View>
      {videoViews}
    </View>
  );
  }

  _handleHelpPress = (text) => {
  const url = 'https://www.youtube.com/embed/'+ text + '?rel=0&autoplay=0&showinfo=0&controls=0';
  console.log(url);
    WebBrowser.openBrowserAsync(url);
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
