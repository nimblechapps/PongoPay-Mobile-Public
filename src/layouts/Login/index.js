import React, {Component} from 'react';
import {View, SafeAreaView, Image} from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color';
import Globals, {ErrorResponse} from './../../utils/Globals';
import KMButton from '../../components/KMButton';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {validatePhone} from '../../utils/validation';
import {ErrorMessage} from '../../utils/message';
import {fontXSmall16, fontLarge24} from '../../utils/theme';
import API from '../../API';
import ProgressHud from '../../components/ProgressHud';
// import ToastMessage from '../../components/toastmessage';
import GlobalStyles from '../../utils/GlobalStyles';
import InputMask from '../../components/InputMask';
import {Routes} from '../../utils/Routes';
import CustomIcon from '../../components/CustomIcon';
import AsyncStorage from '@react-native-community/async-storage';


const images = {
  logoImage: require('./../../../src/assets/Images/logo.png'),
};

let title = {
  normalTitle: 'Welcome back!',
  errorTitle: 'Phone number must be between 10-13 digits',
};

export default class Login extends Component {
  static navigationOptions = ({}) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: {
        value: '',
        message: '',
        isValid: false,
      },
      countryCode: Globals.countryCode,
      isLoading: false,
      autoFocus: true,
      title: 'Welcome back!'
    };
  }

  componentWillUnmount() {
    this.setState({
      autoFocus: false,
    });
  }
  async componentDidMount(){
    await AsyncStorage.getItem("alreadyLaunched").then(value => {
      if(value == null){
        AsyncStorage.setItem('alreadyLaunched', 'true');
        this.setState({
          title: "Welcome to PongoPay!"
        })
      }
    })
  }
  render() {
    const {navigate} = this.props.navigation;
    const {isLoading, phoneNumber, countryCode /*toastData*/} = this.state;

    return (
      <SafeAreaView style={styles.container} >
        <KeyboardAwareScrollView
        
          scrollEnabled={true}
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            Globals.isIpad ? styles.scrollViewPad : styles.scrollView
          }>
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
                fontSize_20
                color={Color.BLACK}
                style={{lineHeight: 24, alignSelf: 'center'}}>
                {this.state.title}                
              </Label>
              
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  zIndex: 111,
                }}>
                <InputMask
                  isNewTitle={true}
                  type={'custom'}
                  options={{mask: '9999999999999'}}
                  placeholder="Phone Number"
                  // LabelTitle='Phone Number'
                  onChangeText={this.onPhoneNumberChange}
                  value={phoneNumber.value}
                  returnKeyType={'done'}
                  keyboardType={'phone-pad'}
                  mainContainerStyle={{
                    borderBottomWidth: 1,
                    borderColor: Color.GreyLightColor,
                    width: '100%',
                  }}
                  countryCodeContainerStyle={{borderWidth: 0}}
                  customStyle={{
                    width: '77%',
                    height: 48,
                    borderWidth: 0,
                    color: Color.DarkGrey,
                    fontFamily: 'Montserrat-Regular',
                    fontSize: fontLarge24,
                  }}
                  countryCodeTxtStyle={{
                    color: Color.DarkGrey,
                    fontSize: fontLarge24,
                    fontFamily: 'Montserrat-Light',
                  }}
                  isCountryCode={true}
                  reference={ref => (this.phone = ref)}
                  countryCode={countryCode}
                  onSelectCountry={() =>
                    this.setState({countryCode: this.phone.getValue()})
                  }>
                  {phoneNumber.message !== '' && (
                    <View
                      style={
                        Globals.isIpad
                          ? GlobalStyles.errorTxtPad
                          : GlobalStyles.errorTxt
                      }>
                      <CustomIcon
                        name={'warning'}
                        style={{
                          color: Color.Red,
                          fontSize: fontXSmall16,
                          alignItems: 'center',
                        }}
                      />
                      <Label
                        fontSize_14
                        Montserrat_Regular
                        color={Color.DarkGrey}
                        style={{paddingLeft: 10}}>
                        {phoneNumber.message}
                      </Label>
                    </View>
                  )}
                </InputMask>
              </View>
              <Image source={require('../../assets/Images/anime/builder_waving.png')}
                    style={{width: '100%',
                      height: 270,
                      resizeMode: 'cover',
                      marginTop: 10,}}
                />
              <KMButton
                fontSize_16
                Montserrat_Medium
                color={Color.BLACK}
                title="Sign In"
                textStyle={{padding: 0}}
                style={{
                  backgroundColor: this.isSubmitDisable()
                    ? Color.GreyLightColor
                    : Color.Yellow,
                  marginTop: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 48,
                  zIndex: -1,
                }}
                disabled={this.isSubmitDisable()}
                onPress={this.onSendOtpClick}
              />

              <Label
                fontSize_16
                color={Color.BLACK}
                mt={35}
                mb={10}
                style={{alignSelf: 'center', marginTop: 35}}>
                {'New to PongoPay?'}
              </Label>

              <KMButton
                fontSize_16
                Montserrat_Medium
                color={Color.DarkBlue}
                title="Sign Up As A Builder"
                style={{
                  marginTop: 10,
                  paddingBottom: 25,
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
                onPress={async () => {
                  await AsyncStorage.setItem('AccountType', 'Individual');
                  navigate(Routes.PhoneNumScreen, { SaveAccountType: 'Individual' })
                }}
                // onPress={() => navigate(Routes.SignUp)}
              />
              
            </View>
          </View>
        </KeyboardAwareScrollView>
        {/* <ToastMessage message={toastData.message} isVisible={toastData.isShow} /> */}
        {isLoading && <ProgressHud />}
      </SafeAreaView>
    );
  }

  onPhoneNumberChange = text => {
    const phoneNumber = this.state.phoneNumber;
    phoneNumber.value = text.trim();

    if (phoneNumber.value.length == 0 || phoneNumber.value == '') {
      phoneNumber.message = ErrorMessage.phoneRequired;
      phoneNumber.isValid = false;
    } else if (!validatePhone(phoneNumber.value)) {
      phoneNumber.message = ErrorMessage.phoneInvalid;
      phoneNumber.isValid = false;
    } else {
      phoneNumber.message = '';
      phoneNumber.isValid = true;
    }
    this.setState({
      phoneNumber,
    });
  };

  isSubmitDisable() {
    return !this.state.phoneNumber.isValid;
  }

  onSendOtpClick = async () => {
    const {navigation, screenProps} = this.props;
    const {navigate} = navigation;
    if (!screenProps.isConnected) {
      return;
    }

    this.setState({isLoading: true});

    const {phoneNumber, countryCode} = this.state;

    try {
      let request = {
        nPhoneNumber: phoneNumber.value,
        nCountryCode: countryCode.replace('+', ''),
      };

      let response = await API.login(request);
      this.setState({isLoading: false});
      console.log('login response', response);
      screenProps.callback(response);

      if (response.status) {
        // this.showHideToast(response)
        navigate(Routes.SignUp_Otp, {
          phoneNumber: phoneNumber.value,
          countryCode: countryCode,
        });
      }
    } catch (error) {
      console.log('login error', error.message);
      this.setState({isLoading: false});
      screenProps.callback(ErrorResponse);
    }
  };
}
