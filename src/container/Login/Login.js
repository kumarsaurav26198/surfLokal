import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { useDispatch } from 'react-redux';
import AppButton from '../../components/AppButton';
import Styles from './Styles';
import jwt_decode from "jwt-decode";
import { googleUser } from '../../modules/googleLogin';
import DeviceInfo from 'react-native-device-info';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import CountryPicker from 'react-native-country-picker-modal'
import { loginUser } from '../../modules/loginUser';
import { loginPhoneUser } from '../../modules/phonelogin'
import { requestUserPermission, NotificationListerner, } from '../../utils/pushnotifications_helper'
import messaging from '@react-native-firebase/messaging';
import { styled } from 'styled-components/native';

export default function Login({ navigation }) {
  const dispatch = useDispatch();
  const screenHeight = Dimensions.get('window').height;
  const fontSizeRatio = screenHeight / 1000;
  const viewSizeRatio = screenHeight / 1000;
  const imageSizeRatio = screenHeight / 1000;
  // const [emailId, setEmailId] = useState('access@wpkraken.io');
  // const [password, setPassword] = useState('CherryPicker1!');
  const [emailId, setEmailId] = useState('saurav5.webperfection@gmail.com');
  const [password, setPassword] = useState('Kumar@123');
  // const [emailId, setEmailId] = useState('');
  // const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [cc, setCC] = useState(0)
  const [withEmail, setWithEmail] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fcmtoken, setFcmtoken] = useState()
  useEffect(async () => {
    const fcmtoken_ = await messaging().getToken()
    setFcmtoken(fcmtoken_)
  }, []);

  useEffect(() => {
    NotificationListerner()
    requestUserPermission()
  }, []);

  useEffect(() => {
    return Platform.OS === 'ios' && appleAuthAndroid.isSupported && appleAuth.onCredentialRevoked(async () => {
    });
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId:
        '681904798882-imtrbvtauorckhqv4sibieoi51rasda4.apps.googleusercontent.com',
      webClientId:
        '681904798882-r41s7mipcih0gdmsau2ds4c21pq4p476.apps.googleusercontent.com',
    });
  }, []);

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      var formdata = new FormData();
      formdata.append('email', userInfo.user.email);
      formdata.append('username', userInfo.user.name);
      formdata.append('social_id', userInfo.user.id);
      formdata.append('social_token', userInfo.idToken);
      formdata.append('device_type', Platform.OS === 'android' ? 1 : 2)
      formdata.append('device_token', fcmtoken)
      formdata.append('user_type',1)
      setLoading(true);
      
      dispatch(googleUser(formdata)).then(response => {
          
        if (response.payload.success) {
         
          setLoading(false);
          navigation.replace('AppIntro');
        } else {
          setLoading(false);
          Alert.alert(response.payload.message);
        }
      });
    } catch (error) {
      setLoading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {
      }
    }
  };
  const handleEmailLogin = () => {
    setWithEmail(true);
  };
  const handleAppleLogin = async () => {

    var formdata = new FormData();
    Platform.OS === 'ios'
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,

      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });


    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
    console.log('credentialState', credentialState)


    if (credentialState === appleAuth.State.AUTHORIZED) {

      console.log('user is authenticated', credentialState)
      console.log('appleAuthRequestResponse ===> ', appleAuthRequestResponse.identityToken)
      var decoded = jwt_decode(appleAuthRequestResponse.identityToken);
      formdata.append('email', decoded.email);
      formdata.append('username', decoded.email);
      formdata.append('social_id', decoded.nonce);
      formdata.append('social_token', appleAuthRequestResponse.identityToken);
      formdata.append('device_type', Platform.OS === 'android' ? 1 : 2)
      formdata.append('device_token', fcmtoken)
      formdata.append('user_type',1)
      console.log('formData ', formdata)
      dispatch(googleUser(formdata)).then(response => {
        if (response.payload.success) {
          setLoading(false);

          navigation.navigate('AppIntro');
        } else {
          setLoading(false);
          Alert.alert(response.payload.message);
        }
      });



      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
      console.log('credentialState', credentialState)


      if (credentialState === appleAuth.State.AUTHORIZED) {

        console.log('user is authenticated', credentialState)
        console.log('appleAuthRequestResponse ===> ', appleAuthRequestResponse.identityToken)
        var decoded = jwt_decode(appleAuthRequestResponse.identityToken);
        formdata.append('email', decoded.email);
        formdata.append('username', decoded.email);
        formdata.append('social_id', decoded.nonce);
        formdata.append('social_token', appleAuthRequestResponse.identityToken);
        formdata.append('device_type', Platform.OS === 'android' ? 1 : 2)
        formdata.append('device_token', fcmtoken)
        formdata.append('user_type',1)
        console.log('formData ', formdata)
        dispatch(googleUser(formdata)).then(response => {
          if (response.payload.success) {
            setLoading(false);
            navigation.navigate('AppIntro');
          } else {
            setLoading(false);
            Alert.alert(response.payload.message);
          }
        });
      }

    };
  }

  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining the access token');
      }
    } catch (error) {
    }
  };


  const accessRequestAction = async () => {
    if (emailId && password != '') {
      if (withEmail) {
        let data = {
          username: emailId,
          password: password,
          device_type: Platform.OS === 'android' ? 1 : 2,
          device_token: fcmtoken,
          user_type: 1
        };
        setLoading(true);
        dispatch(loginUser(data)).then(response => {
          if (response.payload.success) {
            setLoading(false);
            navigation.navigate("AppIntro")
          } else {
            setLoading(false);
            Alert.alert(response.payload.message);
          }
        });
      } else {
        if (phone) {
          setLoading(true);
          var formdata = new FormData();
          formdata.append('county_code', cc);
          formdata.append('phone_number', phone);
          formdata.append('device_type', Platform.OS === 'android' ? 1 : 2)
          formdata.append('device_token', fcmtoken)
          await dispatch(loginPhoneUser(formdata)).then(response => {
            if (response?.payload?.success) {
              setLoading(false);
              navigation.navigate('OtpScreen', { cc: cc, phone: phone ,authToken:response.payload.data.authToken});
            } else {
              setLoading(false);
              Alert.alert(response.payload.message);
            }
          });
        } else {
          alert('Enter Phone number')
        }
      }
    } else Alert.alert('Enter email and password');
  };

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MainWrapper >
          <ImageView source={Images.appLogo} height={200 * imageSizeRatio} width={250 * imageSizeRatio}></ImageView>
          {!withEmail ? (
            <RegionUpperView height={300 * viewSizeRatio}>
              <LoginContainer height={160 * viewSizeRatio} borderWidth={1 * viewSizeRatio} borderColor={Colors.textColorLight}>
                <RegionView height={80 * viewSizeRatio} borderColor={Colors.textColorLight}
                  onPress={() => { setModalVisible(!modalVisible) }}>
                  <CountryPickerView>
                    <TextWrapper fontWeight={300} allowFontScaling={false} color={Colors.textColorLight} fontSize={16 * fontSizeRatio}>
                      Country/Region
                    </TextWrapper>
                    <CountryPickerChildView>
                      <CountryPicker
                        withFilter={true}
                        visible={modalVisible}
                        withCallingCodeButton={true}
                        withCountryNameButton={true}
                        withAlphaFilter={true}
                        withCallingCode={true}
                        onSelect={(data) => {
                          setCountryCode(data.cca2)
                          setCC(data.callingCode[0])
                        }}
                        withModal={true}
                        onClose={() => { setModalVisible(false) }}
                        countryCode={countryCode}

                      />
                      <ImageView source={Images.downArrow} height={18 * imageSizeRatio} width={18 * imageSizeRatio}></ImageView>
                    </CountryPickerChildView>
                  </CountryPickerView>

                </RegionView>
                <PhoneInputView height={80 * viewSizeRatio} borderTopWidth={1 * viewSizeRatio} borderColor={Colors.textColorLight}>
                  <TextInput
                    style={Styles.inputStyle}
                    placeholderTextColor={Colors.textColorLight}
                    placeholder={'Phone Number'}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    secureTextEntry={false}
                    maxLength={12}
                    value={phone}
                    onChangeText={value => { setPhone(value) }}
                  />
                </PhoneInputView>
              </LoginContainer>
              <View style={{ width: '85%', marginTop: 20 * viewSizeRatio }}>
                <Text allowFontScaling={false} style={Styles.alertText}>
                  We''ll call or text to confirm your number. Standard {'\n'}
                  message and data rates apply.
                </Text>
              </View>

            </RegionUpperView>
          ) : (
            <RegionUpperView height={300 * viewSizeRatio}>
              <LoginContainer height={160 * viewSizeRatio} borderWidth={1 * viewSizeRatio} borderColor={Colors.textColorLight}>
                <TextInput
                  allowFontScaling={false}
                  style={Styles.inputStyle}
                  placeholderTextColor={Colors.textColorLight}
                  placeholder={'Email'}
                  keyboardType="default"
                  returnKeyType="done"
                  value={emailId}
                  onChangeText={emailId => setEmailId(emailId)}
                />
                <View style={Styles.phoneInputView}>
                  <TextInput
                    allowFontScaling={false}
                    style={Styles.inputStyle}
                    placeholderTextColor={Colors.textColorLight}
                    placeholder={'Password'}
                    keyboardType="default"
                    returnKeyType="done"
                    value={password}
                    secureTextEntry={true}
                    onChangeText={password => setPassword(password)}
                  />
                </View>
              </LoginContainer>
              <View style={Styles.textvIew}>
                <Text allowFontScaling={false} style={[Styles.alertText, { fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12, }]}>
                  Please enter your email & password registerd with us and
                  start surfing
                </Text>
              </View>
            </RegionUpperView>
          )}

          <AppButton
            onPress={() => accessRequestAction()}
            loading={loading}
            btnText={'Continue'}
          />
          <View
            style={Styles.actionView}>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <TextWrapper
                fontWeight={400}
                fontSize={DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14}
                color={Colors.primaryBlue}
              >
                Sign Up
              </TextWrapper>
            </TouchableOpacity>
            <View style={{ width: '5%', alignItems: 'center' }}>
              <View
                style={Styles.divider}></View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}>
              <TextWrapper
                fontWeight={400}
                fontSize={DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14}
                color={Colors.primaryBlue}
              >
                Forgot Password
              </TextWrapper>
            </TouchableOpacity>
          </View>

          {!withEmail ? (
            <TouchableOpacity
              onPress={() => handleEmailLogin()}
              style={Styles.socialMediaButtons}>
              <Image
                source={Images.email}
                style={Styles.socialMediaButtonsImage}></Image>
              <TextWrapper
                fontWeight={500}
                allowFontScaling={false}
                fontSize={DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14}
                color={Colors.black}
              >
                {'  '}Continue with Email
              </TextWrapper>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setWithEmail(false)}
              style={Styles.socialMediaButtons}>
              <Image
                source={Images.contactAgent}
                style={Styles.socialMediaButtonsImage}></Image>
              <TextWrapper
                fontWeight={500}
                allowFontScaling={false}
                fontSize={DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14}
                color={Colors.black}
              >
                {'  '}Continue with Phone
              </TextWrapper>
            </TouchableOpacity>
          )}

          {Platform.OS != 'android' ? (
            <TouchableOpacity
              onPress={() => handleAppleLogin()}
              style={Styles.socialMediaButtons}>
              <Image
                source={Images.apple}
                style={Styles.socialMediaButtonsImage}></Image>
              <TextWrapper
                fontWeight={500}
                allowFontScaling={false}
                fontSize={DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14}
                color={Colors.black}
              >
                {'  '}Continue with Apple
              </TextWrapper>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() => googleLogin()}
            style={Styles.socialMediaButtons}>
            <Image
              source={Images.google}
              style={Styles.socialMediaButtonsImage}></Image>
            <TextWrapper
              fontWeight={500}
              allowFontScaling={false}
              fontSize={DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14}
              color={Colors.black}
            >
              {'  '}Continue with Google
            </TextWrapper>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleFacebookLogin()}
            style={Styles.socialMediaButtons}>
            <Image
              source={Images.facebook}
              style={Styles.socialMediaButtonsImage}></Image>
            <TextWrapper
              fontWeight={500}
              allowFontScaling={false}
              fontSize={DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14}
              color={Colors.black}
            >
              {'  '}Continue with Facebook
            </TextWrapper>
          </TouchableOpacity>
        </MainWrapper>
      </ScrollView>
    </SafeAreaView>

  );
}


const PhoneInputView = styled.View`
  height: ${props => props.height}px;
  width: 100%;
  border-top-width: ${props => props.borderTopWidth}px;
  border-color: ${props => props.borderColor};
  justify-content: center;
  align-items: center;
  flex-direction: row;
  font-size:14px;
`;

const CountryPickerChildView = styled.View`
  width: 100%;
  justify-content: space-between;
  flex-direction:row;
`;

const TextWrapper = styled.Text`
    color: ${props => props.color};
    font-size: ${props => props.fontSize}px;
    font-family: Poppins-Regular;
    font-weight:${props => props.fontWeight};
`;

const CountryPickerView = styled.View`
  width: 100%;
  justify-content: space-between;
  padding-horizontal: 16px;
`;

const RegionView = styled.TouchableOpacity`
  height: ${props => props.height}px;
  width: 100%;
  flexDirection: row;
  border-color: ${props => props.borderColor} ;
  justify-content: center;
  align-items: center;
`;

const LoginContainer = styled.View`
  height: ${props => props.height}px;
  width: 85%;
  borderRadius: 8px;
  border-width: ${props => props.borderWidth}px;
  border-color: ${props => props.borderColor};
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const RegionUpperView = styled.View`
  height: ${props => props.height}px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ImageView = styled.Image`
  height: ${props => props.height}px;
  width:  ${props => props.width}px;
  alignSelf: center;
  resizeMode: contain;
`;

const MainWrapper = styled.View`
  flex:1;
`;