import React from 'react';
import {
  AsyncStorage,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import colors from "../config/colors";
import strings from "../config/strings";
import VideoList from "../components/VideoList";

export default class SearchScreen extends React.Component {
  state = {
    search: '',
    videos:[],
    user_id: 0,
  };

  componentDidMount() {
    this.refs.searchBar.focus();
    this._loadInitialState().done();
  }

  async _loadInitialState() {
    const user_id = await AsyncStorage.getItem("user_id");
    if (user_id != null) {
      this.setState({ user_id: user_id });
    }
  }

  static navigationOptions = {
    title: 'Search',
  };

  updateSearch = search => {
    this.setState({ search: search });
    fetch(strings.HOST + '/users/' + this.state.user_id + '/search', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyword: this.state.search,
      }),
    }).then(res => res.json())
    .then(res => this.setState({videos:res}));
  };

  searchPress = () => {
    this.refs.searchBar.unFocus();
  };

  render() {
    return (
      <View style={styles.viewStyle}>
        <SearchBar
          ref='searchBar'
          round
          searchIcon={{ size: 24 }}
          onChangeText={this.updateSearch}
          onSearchButtonPress={this.searchPress}
          placeholder="Type Here..."
          value={this.state.search}
          containerStyle={styles.searchBarStyle}
          inputContainerStyle={styles.inputContainerStyle}
          />

        <ScrollView style={styles.container}>
          <Text style={styles.summaryStyle}>
            Found {this.state.videos.length} videos
          </Text>
          <VideoList
            videos = {this.state.videos}
            screen = {this}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    backgroundColor:'white',
    marginTop: 0
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBarStyle: {
    backgroundColor:colors.BLUE,
  },
  inputContainerStyle: {
    backgroundColor:colors.WHITE,
  },
  summaryStyle: {
    fontSize: 16,
    marginTop: 6,
    marginBottom: 6,
    textAlign: "center",
    fontStyle: 'italic',
  },
});
