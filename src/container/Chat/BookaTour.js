import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Colors from '../../utils/Colors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {store} from '../../redux/store';
import {TypingAnimation} from 'react-native-typing-animation';
import {AutoScrollFlatList} from 'react-native-autoscroll-flatlist';
import Images from '../../utils/Images';
import {pushNotificaton} from '../../modules/pushNotificaton';
import {getChatDetail} from '../../modules/getChatDetail';
import {sendMessage} from '../../modules/sendMessage';
import DatePicker from 'react-native-date-picker';
import DeviceInfo from 'react-native-device-info';

const BookaTour = props => {

  const postid = props.route.params;
  const navigation = useNavigation();
  const [message, setMessage] = useState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [getMesg, setGetMessg] = useState([]);
  const [userID, setUserID] = useState(null);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getChatDetailApiCall()
  }, [])

  useEffect(() => {
    const UserID =store.getState().getProfileReducer.getProfileData?.data[0]?.UserID
    setUserID(UserID);
  }, [])
  const getChatDetailApiCall = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('propid', postid?.PropID);
    await dispatch(getChatDetail(formData)).then(response => {
      setGetMessg(response?.payload?.data?.data);
      setLoading(false);
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.mainView}>
        <View style={styles.arrowView}>
          <TouchableOpacity
            style={styles.arrowTouchablopacity}
            onPress={() => navigation.goBack()}>
            <Image
              style={styles.imagestyle}
              source={Images.leftnewarrow}></Image>
          </TouchableOpacity>
          <Text style={styles.scheduleText}>Schedule a Tour</Text>
        </View>
        <Text style={styles.cythiaText}>Hi! What can I help you with?</Text>
        <AutoScrollFlatList
          nestedScrollEnabled={true}
          inverted
          data={getMesg}
          threshold={20}
          renderItem={({item, index}) => {
            return (
              <View style={styles.lokalmsg}>
                {item.message ===
                'A Lokal agent will confirm with you within the next 2 hours' ? (
                  <Text style={styles.messageText}>{item.message}</Text>
                ) : (
                  <Text
                    style={[styles.msgtxt,{                    
                      backgroundColor:item.user_id === userID
                          ? Colors.surfblur
                          : "#D3D3D3",
                      alignSelf: item.user_id === userID ? 'flex-end' : 'flex-start',                     
                      alignContent: 'center',               
                      color: item.user_id === userID ? Colors.white : Colors.black,
                    }]}>
                    {item.message}
                  </Text>
                )}
              </View>
            );
          }}></AutoScrollFlatList>

        <View style={styles.viewstyle}>
          {loading && getMesg?.length > 2 && (
            <Text style={styles.textmessage}>{message}</Text>
          )}

          {loading && getMesg?.length > 2 && (
            <View style={styles.view1}>
              <Text style={styles.textstyle}>typing</Text>
              <TypingAnimation
                dotColor="black"
                dotMargin={3}
                dotAmplitude={2}
                dotSpeed={0.15}
                dotRadius={1}
                dotX={8}
                dotY={0}
                style={styles.typingstyle}
              />
            </View>
          )}

          <View style={styles.textinputview}>
            <TextInput
              style={styles.textinputstyle}
              placeholder={
                getMesg?.length < 1
                  ? 'Select Date from Calender'
                  : ' Type here ....'
              }
              placeholderTextColor={Colors.textColorLight}
              fontFamily="Poppins-Regular"
              value={message}
              editable={getMesg?.length <= 2 ? false : true}
              onChangeText={setMessage}
            />
            {getMesg?.length < 1 ? (
              <TouchableOpacity
                disabled={getMesg.length < 2 ? false : true}
                onPress={() => {
                  setOpen(true);
                  setDate(new Date());
                }}
                style={styles.touchableopacitystyle}>
                <Image style={styles.colastyle} source={Images.cola} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={getMesg?.length > 2 ? false : true}
                onPress={() => {
                  setLoading(true);
                  { const formData = new FormData();
                    formData.append( 'propid', postid.PropID );
                    formData.append( 'user2_id', postid?.user2_id? postid?.user2_id: 0);
                    formData.append('message',message);
                    dispatch( sendMessage(formData)).then(res => {
                      setLoading(false);
                      setMessage('');
                      if (res.payload.data.success) {
                        getChatDetailApiCall();
                      }
                    });
                  }
                }}
                style={styles.touchableopacitystyle}>
                <Image style={styles.sendimage} source={Images.sendm} />
              </TouchableOpacity>
            )}
          </View>
          <DatePicker
            modal
            open={open}
            date={date}
            accessibilityLiveRegion="en"
            minimumDate={new Date()}
            locale="en-GB"
            theme="light"
            mode="datetime"
            onConfirm={date => {
              setOpen(false);
              const now = date.toDateString();
              const time = date.getHours() + ':' + date.getMinutes();
              { const formData = new FormData();
                formData.append('propid',  postid.PropID);
                formData.append('user2_id',  postid?.user2_id ? postid?.user2_id: 0);
                formData.append('message', now + ',' + time);
                dispatch(sendMessage(formData))
                  .then(res => {
                    setLoading(false);
                    setMessage('');
                    if (res.payload.data.success) {
                      getChatDetailApiCall();
                      {  const payload = {
                          propid: postid?.PropID,
                          schedule_hour: time,
                          schedule_day: now,
                          user_mobile: store.getState().loginUserReducer?.loginData?.data?.mobile};
                           console.log("pushNotificaton payload",payload)
                        dispatch(pushNotificaton(payload));
                      }
                    }
                  })
              }
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BookaTour;

const styles = StyleSheet.create({
  screen1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.gray,
  },
  scheduleText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: Colors.black,
  },
  cythiaText: {
    marginLeft: 15,
    marginRight: 13,
    fontSize: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
    maxWidth: '100%',
    marginTop: 22,
    color: Colors.black,
    fontFamily: 'Poppins-Medium',
  },
  messageText: {
    fontSize: 16,
    borderRadius: 16,
    backgroundColor: '#D3D3D3',
    alignSelf: 'flex-start',
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    maxWidth: '70%',
    marginLeft: 8,
    marginRight: 8,
    paddingHorizontal: 8,
    minHeight: 50,
    color: Colors.black,
  },
  view1:{flexDirection: 'row'},

  viewstyle: {
    bottom: 10,
    position: 'absolute',
    zIndex: 99,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
  },
  textmessage: {
    padding: 16,
    fontSize: 16,
    borderRadius: 16,
    backgroundColor: Colors.surfblur,
    alignSelf: 'flex-end',
    maxWidth: '70%',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 0,
    color: Colors.white,
  },
  textstyle: {
    padding: 16,
    fontSize: 16,
    borderRadius: 16,
    backgroundColor: Colors.surfblur,

    alignSelf: 'flex-end',
    maxWidth: '70%',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 0,
    color: Colors.white,
  },
  lokalmsg:{marginBottom: 5},
  textinputview: {
    backgroundColor: Colors.white,
    borderColor: Colors.BorderColor,
    borderWidth: 1,
    borderRadius: 5,
    height: 45,
    margin: 16,
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  msgtxt:{ textAlignVertical: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '70%',
  marginLeft: 8,
  marginRight: 8,
  paddingHorizontal: 8,
  minHeight: 50,
  fontSize: 16,
  borderRadius: 16
},
  textinputstyle: {
    width: '80%',
    backgroundColor: Colors.white,
    color: Colors.black,
  },
  typingstyle:{marginTop: 25, marginLeft: -3},
  touchableopacitystyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colastyle: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  sendimage: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    tintColor: Colors.primaryBlue,
  },
  mainView: {
    height: '100%',
    position: 'relative',
    paddingBottom: 100,
  },
  arrowView: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: Colors.BorderColor,
    borderBottomWidth: 1,
  },
  arrowTouchablopacity: {
    position: 'absolute',
    left: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 50,
    height: 50,
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  imagestyle: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 57 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 57 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
    tintColor: '#D3D3D3',
  },
});
