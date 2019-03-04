import * as React from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  AsyncStorage,
  StyleSheet,
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
      console.log('Log in success!', JSON.stringify(response));
      await AsyncStorage.setItem('userToken', 'abc');
      this.props.navigation.navigate('Main');
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
    console.log("Registered button pressed");
    this.props.navigation.navigate('Register')
  };

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
      <KeyboardAvoidingView
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
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  }
});

export default LoginScreen;
