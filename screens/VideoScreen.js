import React from 'react';
import {
  AsyncStorage,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

import { Icon } from 'react-native-elements';
import { WebBrowser } from 'expo';
import colors from "../config/colors";
import Input from "../components/Input";
import constants from "../config/constants";
import strings from "../config/strings";
import Layout from "../config/Layout";

export default class VideoScreen extends React.Component {
  state = {
    similarVideos: null,
    like: null,
    save: null,
    watch: null,
    user_id: null,
    comments: [],
    categories: []
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
    const video = this.props.navigation.getParam('video');
    try {
      res = await fetch(strings.HOST + "/videos/" + video.video_id + "/similar/" + constants.TOP_K_SIMILAR_VIDEOS, {
              method: 'GET',
              headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              },
          });
      res = await res.json();
      this.setState({similarVideos:res});
    } catch (error) {
      console.log(error);
    }
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      if (user_id !== null){
        this.setState({user_id:user_id});
        detail = await fetch(strings.HOST + "/videos/" + video.video_id + "/activity/" + user_id, {
                method: 'GET',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
            });
        detail = await detail.json();
        for (const index in detail) {
          const video = detail[index];
          if (video['action'] == 'LIKE') {
            this.setState({like:video['count']});
          } else if (video['action'] == 'SAVE') {
            this.setState({save:video['count']});
          } else if (video['action'] == 'WATCH') {
            this.setState({watch:video['count']});
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    try {
      res = await fetch(strings.HOST + "/videos/" + video.video_id + "/comments", {
              method: 'GET',
              headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              },
          });
      res = await res.json();
      this.setState({comments:res});
    } catch (error) {
      console.log(error);
    }

    try {
      res = await fetch(strings.HOST + "/videos/" + video.video_id + "/categories", {
              method: 'GET',
              headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              },
          });
      res = await res.json();
      this.setState({categories:res});
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const similarVideos = this.state.similarVideos === null ? [] :  this.state.similarVideos;
    const similarVideoViews = similarVideos.map((video) =>
    <View style={styles.similarRow} key={video.youtube_id}>
      <TouchableOpacity onPress={() =>this._handleSimilarVideo(video)} style={styles.similarRow}>
        <Image
          source={{uri: 'https://img.youtube.com/vi/' + video.youtube_id + '/0.jpg'}}
          style={styles.similarVideoImage}
        />
        <Text style={styles.similarVideoTitleText}>{video.title}</Text>
      </TouchableOpacity>
    </View>
    );
    const commentViews = this.state.comments.map(comment =>
      <View style={styles.commentBox} key={comment.username + comment.created_time}>
        <Text style={styles.userCommentText}>{comment.username} - {comment.created_time}</Text>
        <Text style={styles.commentText}>{comment.content}</Text>
      </View>
    )
    const categoryString = this._getCategoryString(this.state.categories);
    const { navigation } = this.props;
    const video = navigation.getParam('video');
    const likeColor = this._getButtonColor(this.state.like == 1);
    const dislikeColor = this._getButtonColor(this.state.like == -1);
    const saveColor = this._getButtonColor(this.state.save == 1);
    return (
        <ScrollView style={styles.container}>
          <View style={styles.container} >
            <TouchableOpacity onPress={() =>this._playVideo(video.youtube_id)} style={styles.helpLink}>
              <Image
                source={{uri: 'https://img.youtube.com/vi/' + video.youtube_id + '/0.jpg'}}
                style={styles.videoImage}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.iconRow}>
            <Icon
              name='play'
              type='font-awesome'
              color={colors.BLUE}
              onPress={() => this._playVideo(video.youtube_id)} />
            <Icon
              name='thumbs-o-up'
              type='font-awesome'
              color={likeColor}
              onPress={() => this._handleAction('LIKE', this.state.like == 1 ? 0 : 1)} />
            <Icon
              name='thumbs-o-down'
              type='font-awesome'
              color={dislikeColor}
              onPress={() => this._handleAction('LIKE', this.state.like == -1 ? 0 : -1)} />
            <Icon
              name='heart'
              type='font-awesome'
              color={saveColor}
              onPress={() => this._handleAction('SAVE', this.state.save == 1 ? 0 : 1)} />
          </View>
          <View style={styles.description}>
            <Text style={styles.videoTitleText}>{video.description}</Text>
            <Text style={styles.videoCategoryText}>Categories: {categoryString}</Text>
          </View>
          <View style={styles.similarVideos}>
            {similarVideoViews}
          </View>
          <View style={styles.commentCaption}>
            <Text style={styles.commentCaptionText}>Comments {this.state.comments.length}</Text>
          </View>
          <Input onSubmit={this._submitComment} />
          {commentViews}

          <View style={styles.paddingBox}/>

        </ScrollView>
    );
  }

  _submitComment = async (text) => {
    const video = this.props.navigation.getParam('video');
    try {
      res = await fetch(strings.HOST + '/videos/' + video.video_id + '/comment/' + this.state.user_id, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: text,
        }),
      });
    } catch (error) {
      console.log(error);
    }
    this._loadInitialState().done();
  }

  _getCategoryString = (categories) => {
    var catString = '';
    if (categories.length > 0) {
      catString = catString + categories[0].name;
      var i;
      for (i = 1; i < categories.length; i++) {
        catString = catString + ", " + categories[i].name;
      }
    }
    return catString;
  }

  _getButtonColor = (enable) => {
    return enable ? colors.BLUE : colors.GRAY;
  }

  _handleAction = (action, count) => {
    const video = this.props.navigation.getParam('video');
    const video_id = video.video_id;
    const user_id = this.state.user_id;
    if (user_id == null) {
      return;
    }
    fetch(strings.HOST + '/videos/' + video_id + '/activity/' + user_id, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: action,
        count: count
      }),
    }).then(res => {
      if (action == 'LIKE') {
        this.setState({like:count});
      } else if (action == 'SAVE') {
        this.setState({save:count});
      } else if (action == 'WATCH') {
        this.setState({watch:count});
      }
    });
  }

  _playVideo = (youtube_id) => {
    const url = 'https://www.youtube.com/embed/'+ youtube_id + '?rel=0&autoplay=0&showinfo=0&controls=0';
    this._handleAction('WATCH', this.state.watch != null ? this.state.watch + 1 : 1);
    WebBrowser.openBrowserAsync(url);
  };

  _handleSimilarVideo = (video) => {
    this.props.navigation.push('Video', {title: video.title, video : video});
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconRow: {
    marginTop: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  description: {
    marginTop: 5,
    marginLeft: 10,
    flex: 1,
    justifyContent: 'space-evenly',
  },
  videoImage: {
    height: 240,
    flex : 1,
  },
  videoTitleText: {
    fontSize: 18,
    color: '#2e78b7',
    marginTop: 5,
  },
  videoCategoryText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  similarVideos: {
    flex: 1,
    backgroundColor: '#fff',
  },
  similarRow: {
    marginTop: 10,
    marginLeft: 12,
    flex: 1,
    flexDirection: 'row',
  },
  similarVideoImage: {
    height: 80,
    flex: 0.5
  },
  similarVideoTitleText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
    flex: 0.5,
  },
  commentCaption: {
    marginTop: 10,
    marginLeft: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#EEE',
  },
  commentBox: {
    marginTop: 10,
    marginLeft: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#EEE',
  },
  commentCaptionText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
  userCommentText: {
    marginTop: 10,
    fontSize: 12,
    color: '#555',
  },
  commentText: {
    marginTop: 10,
    fontSize: 14,
    color: '#000',
  },
  paddingBox: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#EEE',
    padding: 100,
  },
});
