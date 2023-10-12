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
import { register } from '../../modules/register';

export default function Register({ navigation }) {
  const dispatch = useDispatch();
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [address, setAddress] = useState('');

  const accessRequestAction = () => {
    if (userName == '') {
      Alert.alert('Please enter user name');
    } else if (emailId) {
      const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(emailId) === true) {
        if (phone == '') {
          Alert.alert('Please enter phone number');
        }
        else if (password == '') {
          Alert.alert('Please enter passoword');
        } else if (confirmPassword == '') {
          Alert.alert('Retype password');
        } else if (password != confirmPassword) {
          Alert.alert("Password and Retype password doesn't match");
        } else {
          userRegisterApiCall();
        }
      } else {
        if (emailId == '') {
          Alert.alert('Enter Email Address');
        } else {
          Alert.alert('Email is Invalid');
        }
      }
    }
  };
  const userRegisterApiCall = () => {
    const formData = new FormData()
    formData.append('username', userName)
    formData.append('email', emailId)
    formData.append('mobile', phone)
    formData.append('user_address', address)
    formData.append('password', password)
    dispatch(register(formData)).then(response => {
      if (response.payload.success == true) {
        Alert.alert(response.payload.message);
        navigation.goBack();
      } else {
        Alert.alert(response.payload.data);
      }
    });
  };

  return (
    <SafeAreaView style={Styles.safearea}>
      <ScrollView style={Styles.container}>
        <View style={Styles.mainWrapper}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={Styles.touch}>
            <Image source={Images.leftnewarrow} style={Styles.arrow}></Image>
          </TouchableOpacity>
        </View>
        <Image source={Images.appLogo} style={Styles.appLogo}></Image>
        <View style={Styles.socialMediaButtons}>
          <TextInput
            allowFontScaling={false}
            style={Styles.inputStyle}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'User Name'}
            keyboardType="default"
            returnKeyType="done"
            value={userName}
            onChangeText={userName => setUserName(userName)}
          />
        </View>
        <View style={Styles.socialMediaButtons}>
          <TextInput
            allowFontScaling={false}
            style={Styles.inputStyle}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Email'}
            keyboardType="email-address"
            returnKeyType="done"
            onChangeText={emailId => setEmailId(emailId)}
          />
        </View>
        <View style={Styles.socialMediaButtons}>
          <TextInput
            allowFontScaling={false}
            style={Styles.inputStyle}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Phone'}
            keyboardType="numeric"
            returnKeyType="done"
            maxLength={12}
            onChangeText={phone => setPhone(phone)}
          />
        </View>

        <View style={Styles.socialMediaButtons}>
          <TextInput
            allowFontScaling={false}
            style={Styles.inputStyle}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Address'}
            keyboardType="default"
            returnKeyType="done"
            onChangeText={address => setAddress(address)}
          />
        </View>

        <View style={Styles.socialMediaButtons}>
          <TextInput
            allowFontScaling={false}
            style={Styles.inputStyle}
            placeholderTextColor={Colors.textColorLight}
            placeholder={'Password'}
            keyboardType="email-address"
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
            keyboardType="email-address"
            returnKeyType="done"
            secureTextEntry={true}
            onChangeText={confirmPassword =>
              setConfirmPassword(confirmPassword)
            }
          />
        </View>
        <AppButton
          onPress={() => accessRequestAction()}
          btnText={'Continue'}
          btnStyle={{
            marginTop: 50,
          }}
        />
        <View style={Styles.belowTextWrapper}>
          <Text style={Styles.textView}>Already have an account ?
          </Text>
          <TouchableOpacity onPress={() => { navigation.navigate("Login") }}>
            <Text style={Styles.signInHere}> Sign-in here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}