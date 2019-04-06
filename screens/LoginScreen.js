import * as React from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import colors from "../config/colors";
import strings from "../config/strings";
import { Icon, Header } from "react-native-elements";

interface State {
  username: string;
  password: string;
  // We add a field that tracks if the user has already
  // touched the input...
  usernameTouched: boolean;
  passwordTouched: boolean;
}

class LoginScreen extends React.Component<{}, State> {
  passwordInputRef = React.createRef();

  state = {
    username: "",
    password: "",
    usernameTouched: false,
    passwordTouched: false
  };

  handleUsernameChange = (username: string) => {
    this.setState({ username: username });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password: password });
  };

  handleUsernameSubmitPress = () => {
    if (this.passwordInputRef.current) {
      this.passwordInputRef.current.focus();
    }
  };

  // ...and we update them in the input onBlur callback
  handleUsernameBlur = () => {
    this.setState({ usernameTouched: true });
  };

  handlePasswordBlur = () => {
    this.setState({ passwordTouched: true });
  };

  handleLoginPress = () => {
    console.log("Login button pressed. Username: " + this.state.username + ", password: " + this.state.password);
    fetch(strings.HOST + "/users/login/", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    }).then(res => res.json())
    .then(async(response) => {
      console.log('Log in success!', response.user_id);
      await AsyncStorage.setItem('user_token', response.token);
      await AsyncStorage.setItem('user_id', '' + response.user_id);
      await AsyncStorage.setItem('username', this.state.username);
      this.props.navigation.navigate('Home',
      {
        user_token: response.token,
        username: this.state.username,
        user_id: response.user_id
      });
    })
    .catch(error => {
      console.log('Log in failed:', error);
      Alert.alert(
        'Invalid username and password',
        'Please try again!'
      );
    });
  };

  handleRegisterPress = () => {
    this.props.navigation.navigate('Register');
  };

  _handleGuest = () => {
    this.props.navigation.navigate('Home')
  }

  render() {
    const {
      username,
      password,
      usernameTouched,
      passwordTouched
    } = this.state;
    // Show the validation errors only when the inputs
    // are empty AND have been blurred at least once
    const usernameError =
      !username && usernameTouched
        ? strings.USERNAME_REQUIRED
        : undefined;
    const passwordError =
      !password && passwordTouched
        ? strings.PASSWORD_REQUIRED
        : undefined;
    return (
      <View
        style={styles.container}
        behavior="padding"
      >
        <View style={styles.form}>
          <FormTextInput
            value={this.state.username}
            onChangeText={this.handleUsernameChange}
            onSubmitEditing={this.handleUsernameSubmitPress}
            placeholder={strings.USERNAME_PLACEHOLDER}
            autoCorrect={false}
            keyboardType="default"
            returnKeyType="next"
            autoCapitalize={"none"}
            onBlur={this.handleUsernameBlur}
            error={usernameError}
          />
          <FormTextInput
            ref={this.passwordInputRef}
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            placeholder={strings.PASSWORD_PLACEHOLDER}
            secureTextEntry={true}
            returnKeyType="done"
            onBlur={this.handlePasswordBlur}
            error={passwordError}
          />
          <Button
            label={strings.LOGIN}
            onPress={this.handleLoginPress}
            disabled={!username || !password}
          />
          <Button
            label={strings.REGISTER}
            onPress={this.handleRegisterPress}
          />
        </View>
        <Text style={styles.guestText} onPress={() =>this._handleGuest()}> Continue as guest</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  form: {
    flex: 0.8,
    justifyContent: "center",
    width: "80%"
  },
  guestText: {
    fontSize: 16,
    color: colors.BLUE,
    marginLeft: 12,
    flex: 0.2
  },
});

export default LoginScreen;
