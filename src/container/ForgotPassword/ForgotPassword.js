import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { useDispatch } from 'react-redux';
import AppButton from '../../components/AppButton';
import Styles from './Styles';
import { emailCheck } from '../../modules/emailCheck';
import { forgotPassword } from '../../modules/forgotPassword';

export default function ForgotPassword({ navigation }) {
  const dispatch = useDispatch();
  const [emailId, setEmailId] = useState('tester1.webperfection@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [resetPasswordScreen, setresetPasswordScreen] = useState(true);

  const accessRequestAction = () => {
    if (emailId != '') {
      let data = {
        email: emailId,
      };
      dispatch(emailCheck(data)).then(response => {
        if (response.payload.success) {
          setresetPasswordScreen(false);
          setUserId(response.payload.data.UserID);
        } else {
          Alert.alert('Yor are not register with us please register ');
        }
      });
    } else Alert.alert('Enter email');
  };
  const go = () => {
    if (password == '') {
      Alert.alert('Enter password');
    } else if (confirmPassword == '') {
      Alert.alert('Enter confirm password');
    } else if (password != confirmPassword) {
      Alert.alert("Password and Confirm password doesn't match");
    } else {
      let data = {
        userID: userId,
        password: password,
        confirm_pass: confirmPassword,
      };
      dispatch(forgotPassword(data)).then(response => {
        if (response.payload.success) {
          navigation.goBack();
        } else {
          Alert.alert('Yor are not register with us please register ');
        }
      });
    }
  };

  const resetPassword = () => (
    <ScrollView style={Styles.container}>
      <View style={Styles.mainView}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={Styles.touchableStyle}>
          <Image source={Images.leftnewarrow} style={Styles.logoStyle}></Image>
        </TouchableOpacity>
      </View>
      <Image source={Images.appLogo} style={Styles.appLogo}></Image>
      <View style={Styles.socialMediaButtons}>
        <TextInput
          allowFontScaling={false}
          style={Styles.inputStyle}
          placeholderTextColor={Colors.textColorLight}
          placeholder={'Email'}
          value={emailId}
          keyboardType="email-address"
          returnKeyType="done"
          onChangeText={emailId => setEmailId(emailId)}
        />
      </View>

      <AppButton
        onPress={() => accessRequestAction()}
        btnText={'Continue'}
        btnStyle={{
          marginTop: 50,
        }}
      />
    </ScrollView>
  );
  const changePassword = () => (
    <ScrollView style={Styles.container}>
      <Image source={Images.appLogo} style={Styles.appLogo}></Image>
      <View style={Styles.loginView}>
        <Text style={Styles.loginText}>
          Welcome to your local real estate search engine!
        </Text>
      </View>
      <View style={Styles.loginLine}></View>
      <View style={Styles.loginView}>
        <Text style={Styles.signUpText}>Change Password</Text>
      </View>

      <View style={Styles.socialMediaButtons}>
        <TextInput
          allowFontScaling={false}
          style={Styles.inputStyle}
          placeholderTextColor={Colors.textColorLight}
          placeholder={'Password'}
          keyboardType="default"
          returnKeyType="done"
          secureTextEntry={true}
          onChangeText={password => setPassword(password)}
        />
      </View>
      <View style={Styles.socialMediaButtons}>
        <TextInput
          allowFontScaling={false}
          style={Styles.inputStyle}
          placeholderTextColor={Colors.textColorLight}
          placeholder={'Confirm Password'}
          keyboardType="default"
          returnKeyType="done"
          secureTextEntry={true}
          onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
        />
      </View>

      <AppButton
        onPress={() => go()}
        btnText={'Continue'}
        btnStyle={{
          marginTop: 50,
        }}
      />

    </ScrollView>
  );
  return (
    <SafeAreaView style={Styles.safearea}>
      {resetPasswordScreen ? resetPassword() : changePassword()}
    </SafeAreaView>
  );
}
