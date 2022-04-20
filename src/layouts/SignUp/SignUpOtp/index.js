import React, {Component} from 'react';
import {View, SafeAreaView, Image, Keyboard} from 'react-native';
import Label from '../../../components/Label';
import Color from '../../../utils/color';
import Globals, {
  afterSuccessLogin,
  ErrorResponse,
} from '../../../utils/Globals';
import KMButton from '../../../components/KMButton';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {validateOtp} from '../../../utils/validation';
import {fontXSmall16} from '../../../utils/theme';
import {ErrorMessage} from '../../../utils/message';
import InputMask from '../../../components/InputMask';
import GlobalStyles from '../../../utils/GlobalStyles';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import API from '../../../API';
// import ToastMessage from '../../../components/toastmessage';
import ProgressHud from '../../../components/ProgressHud';
import {setStoredData} from '../../../utils/store';
import CustomIcon from '../../../components/CustomIcon';
import {Routes} from '../../../utils/Routes';
import AsyncStorage from '@react-native-community/async-storage';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const images = {
  logoImage: require('../../../../src/assets/Images/logo.png'),
};

export default class SignUpOtp extends Component {
  static navigationOptions = ({navigation}) => ({
    headerStyle: GlobalStyles.topbar,
    headerLeft: (
      <HeaderLeft
        iconName="left-arrow"
        iconStyle={{padding: 10}}
        onPress={() => {
          navigation.goBack();
        }}
      />
    ),
  });

  constructor(props) {
    super(props);
    const {params = {}} = props.navigation.state;
    this.state = {
      isLoading: false,
      otp: {
        value: '',
        message: '',
        isValid: false,
      },
      phoneNumber: params.phoneNumber,
      countryCode: params.countryCode,
      isVisible: true,
      // toastData: {
      //     isShow: false,
      //     message: ""
      // },
    };
  }

  render() {
    const {isLoading, otp /*toastData*/} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView
          scrollEnabled={true}
          enableOnAndroid={true}
          scrollEnabled={false}
          contentContainerStyle={
            Globals.isIpad ? styles.scrollViewPad : styles.scrollView
          }>
          <View style={GlobalStyles.topCustomHeader}>
            <HeaderLeft
              iconName="left-arrow"
              onPress={() => {
                this.props.navigation.goBack();
              }}
            />
          </View>

          <View
            style={
              Globals.isIpad ? styles.boxShadowViewPad : styles.boxShadowView
            }>
            <View
              style={
                Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView
              }>
              <Image
                source={images.logoImage}
                style={Globals.isIpad ? styles.logoStylePad : styles.logoStyle}
              />
            </View>
            <View style={Globals.isIpad ? styles.mainViewPad : styles.mainView}>
              <Label
                fontSize_16
                color={Color.BLACK}
                mb={32}
                style={{lineHeight: 24}}>
                A text message with a verification code has been sent to your
                phone
              </Label>

              {/* <View style={{ flexDirection: 'row', justifyContent: "space-between", zIndex: 111 }}>
                                <InputMask
                                    placeholder='Enter OTP'
                                    LabelTitle='OTP'
                                    type={'custom'}
                                    style={{ backgroundColor: 'green' }}
                                    options={{ mask: '999999' }}
                                    onChangeText={this.onOtpChange}
                                    value={otp.value}
                                    keyboardType={"numeric"}
                                    returnKeyType="done"
                                    secureTextEntry={this.state.isVisible}
                                    customStyle={{ height: 48 }}
                                    autoFocus={true}
                                    isRightButton={true}
                                    showIcon="eye_show"
                                    hideIcon="eye_hide"
                                    onPress={() => {
                                        this.setState({
                                            isVisible: !this.state.isVisible
                                        })
                                    }}
                                >

                                    {otp.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{otp.message}</Label>
                                        </View>
                                    }
                                </InputMask>
                            </View>
                            */}
              <View style={styles.mainView}>
                <View style={styles.centerView}>
                  <Label fontSize_20 Montserrat_Light color={Color.DarkGrey}>
                    Now enter the code we've sent you{' '}
                  </Label>
                  <View>
                    <OTPInputView
                      style={{width: '95%', height: 60, paddingTop: 10}}
                      pinCount={6}
                      onCodeChanged={this.onOtpChange}
                      autoFocusOnLoad={false}
                      secureTextEntry
                      codeInputFieldStyle={styles.underlineStyleBase}
                      codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    />
                  </View>

                  {otp.message !== '' && (
                    <View style={GlobalStyles.newErrorView}>
                      <CustomIcon
                        name={'warning'}
                        style={GlobalStyles.errorIcon}
                      />
                      <Label
                        fontSize_14
                        Montserrat_Regular
                        color={Color.DarkGrey}>
                        {otp.message}
                      </Label>
                    </View>
                  )}
                </View>
              </View>
              <KMButton
                fontSize_16
                Montserrat_Medium
                color={Color.BLACK}
                title="SUBMIT"
                textStyle={{padding: 0}}
                style={{
                  backgroundColor: this.isSubmitDisable()
                    ? Color.GreyLightColor
                    : Color.Yellow,
                  marginTop: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 48,
                  zIndex: -1,
                }}
                disabled={this.isSubmitDisable()}
                onPress={this.onSubmitOtpClick}
              />

              <KMButton
                fontSize_16
                Montserrat_Medium
                color={Color.DarkBlue}
                title="Resend Verification Code"
                style={{
                  marginTop: 32,
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
                onPress={this.onReSendOtpClick}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        {/* <ToastMessage message={toastData.message} isVisible={toastData.isShow} /> */}
        {isLoading && <ProgressHud />}
      </SafeAreaView>
    );
  }

  onOtpChange = text => {
    const otp = this.state.otp;
    otp.value = text.trim();

    if (otp.value.length == 0 || otp.value == '') {
      otp.message = ErrorMessage.otpRequired;
      otp.isValid = false;
    } else if (!validateOtp(otp.value)) {
      otp.message = ErrorMessage.otpInvalid;
      otp.isValid = false;
    } else {
      otp.message = '';
      otp.isValid = true;
    }
    this.setState({
      otp,
    });
  };

  isSubmitDisable() {
    return !this.state.otp.isValid;
  }

  onSubmitOtpClick = async () => {
    const {navigation, screenProps} = this.props;
    const {navigate} = navigation;
    if (!screenProps.isConnected) {
      return;
    }
    console.log('FCM TOKEN', global.deviceToken);
    console.log('Os', global.os);

    this.setState({isLoading: true});

    let fcmToken = await AsyncStorage.getItem('fcmToken');

    const {phoneNumber, otp} = this.state;
    let request = {};
    try {
      if (global.os === 'ios') {
        request = {
          nPhoneNumber: phoneNumber,
          nOtp: otp.value,
          iosToken: global.deviceToken,
          fcmToken: fcmToken,
        };
      } else {
        request = {
          nPhoneNumber: phoneNumber,
          nOtp: otp.value,
          androidToken: global.deviceToken,
          fcmToken: fcmToken,
        };
      }
      let response = await API.verifyOtp(request);
      this.setState({isLoading: false});
      console.log('verifyOtp response', response);
      if (response.status) {
        // this.showHideToast(response)
        // screenProps.callback(response)

        await AsyncStorage.setItem('UserKey', response.data.user._id)
        await setStoredData(
          Globals.kUserData,
          JSON.stringify(response.data.user),
        );
        await setStoredData(Globals.kToken, response.data.token);
        await setStoredData(
          Globals.kChannels,
          JSON.stringify(response.data.channels),
        );
        global.channels = JSON.stringify(response.data.channels);
        await setStoredData('AccountType', response.data.user.sAccountType);

        if (response.data.user.isProfileCompleted) {
          afterSuccessLogin(this.props, response.data.user);
        } else {
          if (response.data.user.currentStep) {
            if (response.data.user.currentStep === Routes.ProfileScreen) {
              navigation.navigate(response.data.user.currentStep, {
                firstname: response.data.user.sFirstName,
                surname: response.data.user.sLastName,
              });
            } else if (
              response.data.user.currentStep === Routes.BusinessAddress
            ) {
              navigation.navigate(response.data.user.currentStep, {
                accountType: response.data.user.sAccountType,
              });
            } else if (
              response.data.user.currentStep === Routes.BusinessNameScreen
            ) {
              navigation.navigate(response.data.user.currentStep, {
                accountType: response.data.user.sAccountType,
              });
            } else if (
              response.data.user.currentStep === Routes.BankDetailsScreen
            ) {
              navigation.navigate(response.data.user.currentStep, {
                accountType: response.data.user.sAccountType,
              });
            } else {
              navigation.navigate(response.data.user.currentStep);
            }
          } else {
            afterSuccessLogin(this.props, response.data.user);
          }
        }
      } else {
        alert(response.msg);
        // screenProps.callback(response)
      }
    } catch (error) {
      console.log('verifyOtp error', error.message);
      this.setState({isLoading: false});
      // screenProps.callback(ErrorResponse)
      alert(error.message);
    }
  };

  onReSendOtpClick = async () => {
    const {screenProps} = this.props;
    if (!screenProps.isConnected) {
      return;
    }

    this.setState({isLoading: true});

    const {phoneNumber, countryCode} = this.state;

    try {
      let request = {
        nPhoneNumber: phoneNumber,
        nCountryCode: countryCode,
      };

      let response = await API.login(request);
      this.setState({isLoading: false});
      console.log('ResendOtp response', response);
      if (response.status) {
        // this.showHideToast(response)
        screenProps.callback(response);
      }
    } catch (error) {
      console.log('ResendOtp error', error.message);
      this.setState({isLoading: false});
    }
  };
}
