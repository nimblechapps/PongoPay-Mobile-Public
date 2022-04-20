import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Image,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import Label from '../../../components/Label';
import Color from '../../../utils/color';
import Globals from '../../../utils/Globals';
import KMButton from '../../../components/KMButton';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ToastMessage from '../../../components/toastmessage';
import {Routes} from '../../../utils/Routes';
import GlobalStyles from '../../../utils/GlobalStyles';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import API from '../../../API';
import ProgressHud from '../../../components/ProgressHud';
import AsyncStorage from '@react-native-community/async-storage';
import {setStoredData} from '../../../utils/store';
import CustomIcon from '../../../components/CustomIcon';
import {ErrorMessage} from '../../../utils/message';

const images = {
  logoImage: require('./../../../assets/Images/logo.png'),
};

const OTPScreen = (props, navigation) => {
  // console.log(props.navigation.state.params.nPhoneNumber, 'PHONE NUMBER WE RECEIVED   ')
  console.log(props.navigation.state.params.nOtp, 'OTP WE RECEIVED');
  // const { navigate } = navigation;

  const [showLoader, setLoader] = useState(false);
  const [phoneNum, setPhoneNum] = useState(
    props.navigation.state.params.nPhoneNumber,
  );
  const [otpCode, setotpCode] = useState(props.navigation.state.params.nOtp);
  const [countryCode, setCountyCode] = useState(
    props.navigation.state.params.countryCode,
  );
  const [errorResponse, setErrorResponse] = useState('');

  const OtpVerification = async () => {
    setLoader(true);
    let fcmToken = await AsyncStorage.getItem('fcmToken');

    const params = {
      nPhoneNumber: phoneNum,
      nCountryCode: countryCode,
      otp: otpCode,
      currentStep: Routes.EmailScreen,
      fcmToken: fcmToken,
    };

    console.log('== params ==', params);

    try {
      let response = await API.userRegister(params);

      setLoader(false);
      console.log('===== response =====', response);
      if (response.status) {
        await setStoredData(
          Globals.kUserData,
          JSON.stringify(response.data.user),
        );
        await setStoredData(Globals.kToken, response.data.token);
        await AsyncStorage.setItem('UserToken', response.data.token);
        props.navigation.navigate(Routes.EmailScreen, {});
      } else {
        setErrorResponse(response.msg);
      }
    } catch (err) {
      console.log('OTP DOES NOT MATCH', err.message);
      setLoader(false);
      setErrorResponse('Wrong OTP');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={GlobalStyles.topCustomHeader}>
        <HeaderLeft
          iconName="left-arrow"
          onPress={() => {
            props.navigation.goBack();
            setLoader(false);
          }}
        />
      </View>
      <KeyboardAwareScrollView
        scrollEnabled={true}
        enableOnAndroid={true}
        contentContainerStyle={styles.scrollView}>
        <View
          style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
          <Image
            source={images.logoImage}
            style={Globals.isIpad ? styles.logoStylePad : styles.logoStyle}
          />
        </View>
        <View style={styles.mainView}>
          <View style={styles.centerView}>
            <Label fontSize_20 Montserrat_Light color={Color.DarkGrey}>
              Now enter the code we've sent you{' '}
            </Label>
            <View>
              <OTPInputView
                style={{width: '95%', height: 60, paddingTop: 10}}
                pinCount={6}
                onCodeChanged={code => {
                  setotpCode(code);
                }}
                autoFocusOnLoad={false}
                secureTextEntry
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
              />
            </View>

            {errorResponse !== '' && (
              <View style={GlobalStyles.newErrorView}>
                <CustomIcon name={'warning'} style={GlobalStyles.errorIcon} />
                <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey}>
                  {errorResponse}
                </Label>
              </View>
            )}
          </View>
        </View>
        <Image
          source={require('../../../assets/Images/anime/otp.png')}
          style={GlobalStyles.animImageStyle}
        />
        <View style={styles.btnPos}>
          <KMButton
            disabled={!(otpCode.length === 6)}
            fontSize_16
            Montserrat_Medium
            color={Color.BLACK}
            title="SUBMIT"
            textStyle={{padding: 0}}
            style={[
              styles.lastMainBtn,
              {
                backgroundColor:
                  otpCode.length === 6 ? Color.Yellow : Color.GreyLightColor,
              },
            ]}
            onPress={() => {
              OtpVerification();
            }}
          />
        </View>
      </KeyboardAwareScrollView>

      {showLoader && <ProgressHud />}
    </SafeAreaView>
  );
};

OTPScreen['navigationOptions'] = ({navigation}) => ({
  headerShown: false,
});

export default OTPScreen;
