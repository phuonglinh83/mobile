import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Text,
  View, TouchableOpacity
} from 'react-native';

export default class Input extends Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  state = {
    text: undefined, // user's input
  };

  // Update state when input changes
  onChangeText = (text) => this.setState({ text });

  // Call this.props.onSubmit handler and pass the comment
  submit = () => {
    const { text } = this.state;
    if (text) {
      this.setState({ text: undefined }, () => this.props.onSubmit(text));
    } else {
      alert('Please enter your comment first');
    }
  };

  render() {
    return (
      // This moves children view with input field and submit button
      // up above the keyboard when it's active
      <KeyboardAvoidingView
        behavior='height'
      >
        <View style={styles.container}>
          {/* Comment input field */}
          <TextInput
            placeholder="Add a comment..."
            keyboardType="twitter" // keyboard with no return button
            autoFocus={false} // focus and show the keyboard
            style={styles.input}
            value={this.state.text}
            onChangeText={this.onChangeText} // handle input changes
          />
          {/* Post button */}
          <TouchableOpacity
            style={styles.button}
            onPress={this.submit}
          >
            {/* Apply inactive style if no input */}
            <Text style={[styles.text, !this.state.text ? styles.inactive : []]}>Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    borderTopWidth: 0,
    borderColor: '#EEE',
    alignItems: 'center',
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15,
  },
  button: {
    height: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactive: {
    color: '#CCC',
  },
  text: {
    color: '#3F51B5',
    fontWeight: 'bold',
    fontFamily: 'Avenir',
    textAlign: 'center',
    fontSize: 15,
  },
});
