import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import strings from "../config/strings";

export default class CategoryListScreen extends React.Component {
  state = {
    categories: [],
  }

  static navigationOptions = {
    title: 'Categories',
  };

  componentDidMount() {
    this._loadInitialState().done();
  }

  async _loadInitialState() {
    try {
      results = await fetch(strings.HOST + "/categories/", {
                  method: 'GET',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                });
      results = await results.json();
      this.setState({categories:results})
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const categories = this.state.categories;
    const categoryViews = categories.map((category) =>
      <Touchable style={styles.option} background={Touchable.Ripple('#ccc', false)}
      onPress={() => this._handlePressCategory(category)} key={category.category_id}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionText}>
              {category.name}
            </Text>
          </View>
        </View>
      </Touchable>
    );

    return (
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.optionsTitleText}>
            All video categories
          </Text>
          {categoryViews}
        </View>
      </ScrollView>
    );
  }

  _handlePressCategory = (category) => {
    this.props.navigation.push('Category', {title: category.name, category : category});
    // console.log("Category pressed");
    // WebBrowser.openBrowserAsync('http://docs.expo.io');
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  optionsTitleText: {
    fontSize: 16,
    marginTop: 6,
    marginBottom: 6,
    textAlign: "center",
    fontWeight: 'bold',
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDEDED',
  },
  optionText: {
    fontSize: 18,
    marginTop: 1,
  },
});
