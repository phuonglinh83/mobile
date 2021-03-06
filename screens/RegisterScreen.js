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
    confirmPasswordTouched: false,
    validUser: true
  };

  handleUsernameChange = (username: string) => {
    this.setState({username: username});
    fetch(strings.HOST + '/users/find', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
      }),
    }).then(res => res.json())
    .then(res => {
      if (res.user_id < 0) {
        this.setState({validUser: true});
      } else {
        this.setState({validUser: false})
      }
    });
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
    fetch(strings.HOST + '/users/register/', {
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
      console.log('Register failed!', error);
      Alert.alert(
        'Username exists',
        'Please try again with different username!'
      );
    })
  };

  render() {
    const {
      username,
      password,
      confirmPassword,
      usernameTouched,
      passwordTouched,
      confirmPasswordTouched,
      validUser
    } = this.state;
    // Show the validation errors only when the inputs
    // are empty AND have been blurred at least once
    const usernameError =
      !username && usernameTouched
        ? strings.USERNAME_REQUIRED
        : (!validUser ? "Username exists" : undefined);
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
        behavior="height"
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
            disabled={!username || !password || password != confirmPassword || !validUser}
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
    alignItems: "center"
  },
  logo: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  form: {
    flex: 1,
    justifyContent: "flex-start",
    width: "80%"
  }
});

export default RegisterScreen;
