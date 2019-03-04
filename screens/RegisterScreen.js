import * as React from "react";
import {
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

interface State {
  username: string;
  password: string;
  confirmPassword: string;
  usernameTouched: boolean;
  passwordTouched: boolean;
  confirmPasswordTouched: boolean;
}

class RegisterScreen extends React.Component<{}, State> {
  passwordInputRef = React.createRef();
  confirmPasswordInputRef = React.createRef();

  state = {
    username: "",
    password: "",
    confirmPassword: "",
    usernameTouched: false,
    passwordTouched: false,
    confirmPasswordTouched: false
  };

  handleUsernameChange = (username: string) => {
    this.setState({ username: username });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password: password });
  };

  handleConfirmPasswordChange = (confirmPassword: string) => {
    this.setState({ confirmPassword: confirmPassword });
  };

  handleUsernameSubmitPress = () => {
    if (this.passwordInputRef.current) {
      this.passwordInputRef.current.focus();
    }
  };

  handlePasswordSubmitPress = () => {
    if (this.confirmPasswordInputRef.current) {
      this.confirmPasswordInputRef.current.focus();
    }
  };

  // ...and we update them in the input onBlur callback
  handleUsernameBlur = () => {
    this.setState({ usernameTouched: true });
  };

  handlePasswordBlur = () => {
    this.setState({ passwordTouched: true });
  };

  handleConfirmPasswordBlur = () => {
    this.setState({ confirmPasswordTouched: true });
  };

  handleCreateAccountPress = () => {
    console.log("Create Account button pressed");
    fetch('http://localhost:8000/users/register/', {
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
      console.log('Success:', JSON.stringify(response));
      await AsyncStorage.setItem('userToken', 'abc');
      this.props.navigation.navigate('Main');
    })
    .catch(error => console.error('Error:', error));
  };

  render() {
    const {
      username,
      password,
      confirmPassword,
      usernameTouched,
      passwordTouched,
      confirmPasswordTouched
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
    const confirmPasswordError =
      !confirmPassword && confirmPasswordTouched || confirmPassword != password
        ? strings.PASSWORD_MATCH
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
            onSubmitEditing={this.handlePasswordSubmitPress}
            placeholder={strings.PASSWORD_PLACEHOLDER}
            secureTextEntry={true}
            returnKeyType="done"
            onBlur={this.handlePasswordBlur}
            error={passwordError}
          />
          <FormTextInput
            ref={this.confirmPasswordInputRef}
            value={this.state.confirmPassword}
            onChangeText={this.handleConfirmPasswordChange}
            placeholder={strings.CONFIRM_PASSWORD_PLACEHOLDER}
            secureTextEntry={true}
            returnKeyType="done"
            onBlur={this.handleConfirmPasswordBlur}
            error={confirmPasswordError}
          />
          <Button
            label={strings.CREATE_ACCOUNT}
            disabled={!username || !password || password != confirmPassword}
            onPress={this.handleCreateAccountPress}
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

export default RegisterScreen;
