/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

/* mangopay profile flow changes(with no optional fields) before client request 06/07/2020 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
  BackHandler
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Label from '../../../components/Label';
import Color from '../../../utils/color';
import LocalImages from '../../../utils/LocalImages';
import styles from './styles';
import Globals, {
  isValidValue,
  Users,
  Accounts,
  getCountryFromIso,
  constant,
  _calculateAge,
  afterSuccessLogin,
  getNationalityFromIso,
} from '../../../utils/Globals';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateCharacter, validateName } from '../../../utils/validation';
import { ErrorMessage } from '../../../utils/message';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import HeaderTitle from '../../../components/Header/HeaderTitle';
import HeaderRight from '../../../components/Header/HeaderRight';
import TextField from '../../../components/TextField';
import KMButton from '../../../components/KMButton';
import GlobalStyles from '../../../utils/GlobalStyles';
import DatePicker from 'react-native-datepicker';
import { Routes } from '../../../utils/Routes';
import { getStoredData, setStoredData } from '../../../utils/store';
import { fontXSmall16, screenWidth, fontLarge24 } from '../../../utils/theme';
import { validateEmail, validatePhone } from '../../../utils/validation';
import InputMask from '../../../components/InputMask';
import moment from 'moment';
import SignatureCapture from 'react-native-signature-capture';
import ImagePicker from 'react-native-image-crop-picker';
import CustomIcon from '../../../components/CustomIcon';
import DropDownCustom from '../../../components/DropDown';

import API from '../../../API';
import ToastMessage from '../../../components/toastmessage';
import ProgressHud from '../../../components/ProgressHud';

const ProfileOptions = ['Individual', 'Business'];
export default class PersonalInformation extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: Globals.isProfileCompleted ? (
        <HeaderLeft
          iconName="left-arrow"
          onPress={() => {
            navigation.goBack();
          }}
        />
      ) : null,
      headerTitle: () => <HeaderTitle title={'Edit Profile'} />,
      headerRight: (
        <HeaderRight
          buttonTitle={Globals.isProfileCompleted ? "" : 'Log out'}
          onPress={() => {
            !Globals.isProfileCompleted && navigation.push(Routes.Login)
          }}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      fromProfilePage: this.props.navigation.state.params.fromProfilePage,
      userPhoto: {
        image: LocalImages.Profile,
        path: '',
      },
      userSignature: {
        image: LocalImages.Signature,
        path: '',
      },
      firstName: {
        value: '',
        message: '',
        isValid: false,
      },
      lastName: {
        value: '',
        message: '',
        isValid: false,
      },
      tradingName: {
        value: '',
        message: '',
        isValid: false,
      },
      companyName: {
        value: '',
        message: '',
        isValid: false,
      },
      dDateofBirthError: {
        message: '',
        isValid: false,
      },
      email: {
        value: '',
        message: '',
        isValid: false,
      },
      phoneNumber: {
        value: '',
        message: '',
        isValid: false,
      },

      companyNumber: {
        value: '',
        message: '',
        isValid: false,
      },
      companyName: {
        value: '',
        message: '',
        isValid: false,
      },
      companyEmail: {
        value: '',
        message: '',
        isValid: false,
      },
      dateObj: null,
      address2: '',
      countryCode: Globals.countryCode,
      nationality: Globals.countryIso,
      nationalityName: Globals.nationalityName,
      countryResName: Globals.countryName,
      countryRes: Globals.countryIso,
      maxDate: new Date(),
      // dDateofBirth: "",
      isShowSignView: false,
      // isSoleTrader: true,
      sAccountType: ProfileOptions[0],
      isBuilder: Globals.isBuilder,
    };
  }

  handleBackButton() {
    !Globals.isProfileCompleted && BackHandler.exitApp()
  }

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.getUserProfile();
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  getUserProfile = async () => {
    this.setState({ isLoading: true });

    try {
      let response = await API.getUserProfile();
      this.setState({ isLoading: false });
      console.log('get user profile response', response);
      if (response.status) {
        if (response.data.hasOwnProperty('sAccountType')) {
          sAccountType = response.data.sAccountType.toLowerCase() == 'individual' ? ProfileOptions[0] : ProfileOptions[1]
        } else {
          sAccountType = ProfileOptions[0]
        }

        await setStoredData(Globals.kUserData, JSON.stringify(response.data));

        // let isSoleTrader = this.state.isSoleTrader;
        if (response.data.hasOwnProperty('wallet_id')) {
          await setStoredData(
            Globals.kProfileComplete,
            JSON.stringify(response.data.isProfileCompleted),
          );
          // isSoleTrader = response.data.sAccountType == 'sole_trader';
        }
        this.setState(
          {
            user: response.data,
            accountType: sAccountType,

          },
          () => this.setFormValues(response.data),
        );
      }
    } catch (error) {
      console.log('get user profile error', error.message);
      this.setState({ isLoading: false });
    }
  };

  setFormValues = data => {
    data.hasOwnProperty('sFirstName') &&
      this.onFirstNameChange(data.sFirstName);
    data.hasOwnProperty('sLastName') && this.onLastNameChange(data.sLastName);
    data.hasOwnProperty('tradingName') && this.onTradingNameChange(data.tradingName);
    data.hasOwnProperty('sEmail') && this.onEmailChange(data.sEmail);
    data.oCompanyDetail && data.oCompanyDetail.hasOwnProperty('sCompanyName') && this.onCompanyNameChange(data.oCompanyDetail.sCompanyName);
    (data.oCompanyDetail && data.oCompanyDetail.hasOwnProperty('sCompanyEmail')) ? this.onCompanyEmailChange(data.oCompanyDetail.sCompanyEmail) : this.onCompanyEmailChange(data.sEmail);

    data.hasOwnProperty('nPhoneNumber') &&
      this.onPhoneNumberChange(data.nPhoneNumber);

    let userPhoto = {};
    userPhoto.image = isValidValue(data.sProfilePic)
      ? { uri: data.sProfilePic }
      : LocalImages.Profile;
    userPhoto.path = isValidValue(data.sProfilePic) ? data.sProfilePic : '';

    // let isSoleTrader = this.state.isSoleTrader;
    // if (data.hasOwnProperty('sAccountType')) {
    //   isSoleTrader =
    //     data.sAccountType == Accounts.SOLE_TRADER ||
    //     data.sAccountType == Accounts.INDIVIUAL;
    // }

    let country = Globals.countryIso;
    // if (data.hasOwnProperty('sTaxCountry')) {
    //   country = data.sTaxCountry;
    // }

    let dob = ''
    if (data.oLegalRepresentativeDetail) {
      dob = data.oLegalRepresentativeDetail.dDob ? new Date(data.oLegalRepresentativeDetail.dDob) : ''
    } else {
      debugger
      dob = data.dDateofBirth ? new Date(data.dDateofBirth) : ''
    }

    this.setState({
      dDateofBirth: dob,
      dateObj: dob,
      userPhoto: userPhoto,
      sAccountType,
      country,
      nationalityName: getNationalityFromIso(data.sNationality),
      profileComplete: data.isProfileCompleted,
    });
  };

  onEmailChange = text => {
    const email = this.state.email;
    email.value = text.trim();

    if (email.value.length == 0 || email.value == '') {
      email.message = ErrorMessage.emailRequired;
      email.isValid = false;
    } else if (!validateEmail(email.value)) {
      email.message = ErrorMessage.emailInvalid;
      email.isValid = false;
    } else {
      email.message = '';
      email.isValid = true;
    }
    console.log('email', email);
    this.setState({
      email,
    });
    // Console.log("email",email)
  };

  onCompanyEmailChange = text => {
    const companyEmail = this.state.companyEmail;
    companyEmail.value = text ? text.trim() : '';

    if (companyEmail.value.length == 0 || companyEmail.value == '') {
      companyEmail.message = ErrorMessage.emailRequired;
      companyEmail.isValid = false;
    } else if (!validateEmail(companyEmail.value)) {
      companyEmail.message = ErrorMessage.emailInvalid;
      companyEmail.isValid = false;
    } else {
      companyEmail.message = '';
      companyEmail.isValid = true;
    }
    console.log('email', companyEmail);
    this.setState({
      companyEmail,
    });
    // Console.log("email",email)
  };
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


  render() {
    const {
      isBuilder,
      userPhoto,
      firstName,
      lastName,
      tradingName,
      isLoading,
      dDateofBirth,
      dDateofBirthError,
      maxDate,
      // isSoleTrader,
      email,
      sAccountType,
      phoneNumber,
      countryCode,
      companyName,
      companyNumber,
      companyEmail,
    } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeVStyle}>
          <KeyboardAwareScrollView>
            <View style={styles.profileSignature}>
              <View>
                <Image style={styles.userPhotoStyle} source={userPhoto.image} />
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={this.onUserPhotoClick}>
                  <CustomIcon name={'edit'} style={{ color: Color.WHITE }} />
                </TouchableOpacity>
              </View>
            </View>
            {isBuilder && (
              <View
                style={{
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingBottom: 48,
                }}>
                <DropDownCustom
                  disabled={this.state.profileComplete}
                  value={this.state.sAccountType}
                  labelTitle="Select Profile"
                  Title="Select Profile"
                  options={ProfileOptions}
                  onOptionChange={selected => {
                    console.log("selected", selected)
                    // if (!this.state.profileComplete) {
                    this.setState({
                      sAccountType: selected
                    });
                    // }
                  }}
                />
              </View>
            )}

            {sAccountType && <View style={styles.informationDetails}>
              <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>
                Personal Information
                </Label>
              <View style={styles.borderLine} />
              <View style={{ width: Globals.isIpad ? 400 : '100%', marginBottom: 20 }}>
                <View style={{}}>
                  <TextField
                    disabled={this.state.profileComplete}
                    placeholder="Enter Email"
                    LabelTitle="Email*"
                    autoCapitalize={'none'}
                    onChangeText={this.onEmailChange}
                    value={email.value}
                    keyboardType={'email-address'}
                    ref={ref => this.emailInput = ref}
                    reference='emailRef'
                    returnKeyType={"next"}>
                    {/* onSubmitEditing={() => this.phoneInput.refs.phoneRef.focus()}> */}
                    {email.message !== '' && (
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
                          style={{ paddingLeft: 10 }}>
                          {email.message}
                        </Label>
                      </View>
                    )}
                  </TextField>
                </View>
                <View style={{ zIndex: -1 }}>
                  <TextField
                    placeholder="First Name"
                    LabelTitle="First Name*"
                    onChangeText={this.onFirstNameChange}
                    value={firstName.value}
                    returnKeyType={"next"}
                    onSubmitEditing={() => this.lastNameInput.refs.lastNameRef.focus()}

                  >

                    {firstName.message !== '' && (
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
                          style={{ paddingLeft: 10 }}>
                          {firstName.message}
                        </Label>
                      </View>
                    )}
                  </TextField>
                </View>
                <View style={{ zIndex: -11 }}>
                  <TextField
                    placeholder="Last Name"
                    LabelTitle="Last Name*"
                    onChangeText={this.onLastNameChange}
                    value={lastName.value}
                    ref={ref => this.lastNameInput = ref}
                    reference='lastNameRef'
                    returnKeyType={"next"}
                    onSubmitEditing={() => this.emailInput.refs.emailRef.focus()}>
                    {lastName.message !== '' && (
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
                          style={{ paddingLeft: 10 }}>
                          {lastName.message}
                        </Label>
                      </View>
                    )}
                  </TextField>
                </View>
                {tradingName.value != '' && <View style={{ zIndex: -11 }}>
                  <TextField
                    placeholder="Trader Name"
                    LabelTitle="Trader Name"
                    onChangeText={this.onTradingNameChange}
                    value={tradingName.value}
                    ref={ref => this.lastNameInput = ref}
                    reference='lastNameRef'
                    returnKeyType={"next"}
                    onSubmitEditing={() => this.emailInput.refs.emailRef.focus()}>
                    {lastName.message !== '' && (
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
                          style={{ paddingLeft: 10 }}>
                          {lastName.message}
                        </Label>
                      </View>
                    )}
                  </TextField>
                </View>}
                <View style={{ zIndex: -111 }}>
                  <DropDownCustom type='country' value={this.state.countryResName} labelTitle='Country of Residence*' Title='Select Nationality' options={[]}
                    onOptionChange={(country) => {
                      console.log("Country", country.iso2)
                      this.setState({ countryRes: country.iso2, countryResName: country.name })
                    }} >
                  </DropDownCustom>
                </View>
                <View style={{ zIndex: -1111 }}>
                  <Label fontSize_16 color={Color.DarkGrey} mb={10}>
                    Birthday*
                    </Label>
                  <DatePicker
                    disabled={this.state.profileComplete}
                    style={{
                      width: Globals.isIpad ? 400 : screenWidth - 30,
                      marginBottom: 20,
                    }}
                    date={dDateofBirth}
                    mode="date"
                    placeholder="DD-MM-YYYY"
                    format="DD-MM-YYYY"
                    maxDate={maxDate}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        display: 'none',
                      },
                      dateText: {
                        fontSize: fontXSmall16,
                        color: Color.BLACK,
                        fontFamily: 'Montserrat-Regular',
                      },
                      placeholderText: {
                        fontFamily: 'Montserrat-Regular',
                        fontSize: fontXSmall16,
                      },
                      dateInput: {
                        marginLeft: 0,
                        borderRadius: 4,
                        height: 48,
                        alignItems: 'flex-start',
                        paddingLeft: 15,
                        paddingRight: 15,
                        borderColor: Color.LightGrey,
                        fontFamily: 'Montserrat-Regular',
                        fontSize: fontXSmall16,
                      },
                    }}
                    onDateChange={(date, datObj) => {
                      console.log('date', datObj);
                      let dDateofBirthError;
                      let dDateofBirth;
                      let dateObj;

                      if (!date) {
                        dDateofBirthError = {
                          message: ErrorMessage.dateOfBirthRequired,
                          isValid: false,
                        };
                      } else if (_calculateAge(datObj) < 16) {
                        dDateofBirthError = {
                          message: ErrorMessage.dateOfBirthInvalid,
                          isValid: false,
                        };
                      } else {
                        dDateofBirthError = {
                          message: '',
                          isValid: true,
                        };
                        dDateofBirth = date
                        dateObj = datObj
                      }
                      this.setState({
                        dDateofBirthError: dDateofBirthError,
                        dDateofBirth: dDateofBirth,
                        dateObj: dateObj
                      }, () => {
                        console.log("Date of birth", this.state.dDateofBirth)
                      });
                    }}
                  />

                  {dDateofBirthError.message != '' && (
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
                        style={{ paddingLeft: 10, paddingRight: 10 }}>
                        {dDateofBirthError.message}
                      </Label>
                    </View>
                  )}
                </View>

                <View style={{ zIndex: -11111 }}>
                  <InputMask
                    disabled={this.state.profileComplete}
                    type={'custom'}
                    options={{ mask: '9999999999999' }}
                    placeholder="Enter Phone Number"
                    LabelTitle="Phone Number*"
                    onChangeText={this.onPhoneNumberChange}
                    value={phoneNumber.value}
                    keyboardType={'phone-pad'}
                    returnKeyType={"done"}
                    customStyle={{ width: '77%', height: 48 }}
                    isCountryCode={true}
                    // reference='phoneRef'
                    // ref={ref => this.phoneInput = ref}

                    // returnKeyType={"done"}
                    countryCode={countryCode}
                    onSelectCountry={() =>
                      this.setState({ countryCode: this.phone.getValue() })
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
                          style={{ paddingLeft: 10 }}>
                          {phoneNumber.message}
                        </Label>
                      </View>
                    )}
                  </InputMask>
                </View>
                <View style={{ zIndex: -11111 }}>
                  <DropDownCustom type='nationality' value={this.state.nationalityName} labelTitle='Nationality*' Title='Select Nationality' options={[]}
                    onOptionChange={(country) => {
                      this.setState({ nationality: country.iso2, nationalityName: country.nationality })
                    }} >
                  </DropDownCustom>
                </View>
              </View>
              {this.state.sAccountType.toLowerCase() == 'business' &&
                <View style={{ alignItems: 'center' }}>
                  <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>Company Information</Label>
                  <View style={styles.borderLine}></View>
                  <View style={{ width: (Globals.isIpad ? 400 : "100%") }}>
                    <View style={{ zIndex: -1 }}>
                      <TextField
                        disabled={this.state.profileComplete}
                        placeholder="Enter Registered Business Name"
                        LabelTitle="Registered Business Name*"
                        onChangeText={this.onCompanyNameChange}
                        value={companyName.value}
                        returnKeyType={"next"}
                      // onSubmitEditing={() => this.companyNumberInput.refs.companyNumberRef.focus()}
                      >
                        {companyName.message !== '' && (
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
                              style={{ paddingLeft: 10 }}>
                              {companyName.message}
                            </Label>
                          </View>
                        )}
                      </TextField>
                    </View>
                    <View style={{ zIndex: -11 }}>
                      <View style={{ zIndex: -111 }}>
                        <TextField
                          disabled={this.state.profileComplete}
                          placeholder="Enter Business Email"
                          LabelTitle="Business Email*"
                          autoCapitalize={'none'}
                          onChangeText={this.onCompanyEmailChange}
                          value={companyEmail.value}
                          ref={ref => this.companyEmailInput = ref}
                          reference='companyEmailRef'
                          returnKeyType={"done"}
                          // onSubmitEditing={() => this.address1Input.refs.address1Ref.focus()}

                          keyboardType={'email-address'}>
                          {companyEmail.message !== '' && (
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
                                style={{ paddingLeft: 10 }}>
                                {companyEmail.message}
                              </Label>
                            </View>
                          )}
                        </TextField>
                      </View>

                    </View>
                  </View>
                </View>}
              <KMButton
                onPress={this.onNextClick}
                fontSize_16
                Montserrat_Medium
                color={Color.BLACK}
                title="NEXT"
                textStyle={{ padding: 0 }}
                style={{
                  zIndex: -7,
                  backgroundColor: this.isSubmitDisable()
                    ? Color.GreyLightColor
                    : Color.Yellow,
                  marginTop: 20,
                  marginBottom: 40,
                  width: Globals.isIpad ? 400 : '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 48,
                }}
                disabled={this.isSubmitDisable()}
              />
            </View>

            }
          </KeyboardAwareScrollView>
          {/* <ToastMessage message={this.state.message} isVisible={this.state.isShowToast} /> */}
          {isLoading && <ProgressHud />}
        </SafeAreaView>
        {/* <NavigationEvents onWillFocus={this.getUserData} /> */}
        {/* {isShowSignView && this.openSignatureView()} */}
      </View>
    );
  }

  onUserPhotoClick = () => {
    Alert.alert(
      'Document',
      'Select Document',
      [
        {
          text: 'Take Photo',
          onPress: () => this.openCameraPicker(true),
        },
        {
          text: 'Select From Gallery',
          onPress: () => this.openCameraPicker(false),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: false },
    );
  };

  openCameraPicker = (isCamera = false) => {
    let options = {
      width: 1000,
      height: 1000,
      cropping: true,
      cropperCircleOverlay: true,
      sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      mediaType: 'photo',
      includeExif: true,
    };
    if (isCamera) {
      ImagePicker.openCamera(options)
        .then(image => {
          console.log('received image', image);
          const userPhoto = this.state.userPhoto;
          // const source = { uri: image.path, width: image.width, height: image.height, mime: image.mime }
          const source = { uri: image.path, mime: image.mime };
          userPhoto.image = source;
          userPhoto.path = image.path;
          this.setState({
            userPhoto,
          });
        })
        .catch(e => {
          console.log(e);
          Alert.alert(e.message ? e.message : e);
        });
    } else {
      ImagePicker.openPicker(options)
        .then(image => {
          console.log('received image', image);
          const userPhoto = this.state.userPhoto;
          // const source = { uri: image.path, width: image.width, height: image.height, mime: image.mime }
          const source = { uri: image.path, mime: image.mime };
          userPhoto.image = source;
          userPhoto.path = image.path;
          this.setState({
            userPhoto,
          });
        })
        .catch(e => {
          console.log(e);
          Alert.alert(e.message ? e.message : e);
        });
    }
  };

  onFirstNameChange = text => {
    const firstName = this.state.firstName;
    firstName.value = text;

    if (firstName.value.length == 0 || firstName.value == '') {
      firstName.message = ErrorMessage.firstNameRequired;
      firstName.isValid = false;
    } else if (!validateName(firstName.value)) {
      firstName.message = ErrorMessage.firstNameInvalid;
      firstName.isValid = false;
    } else {
      firstName.message = '';
      firstName.isValid = true;
    }
    this.setState({
      firstName,
    });
  };

  onLastNameChange = text => {
    const lastName = this.state.lastName;
    lastName.value = text;

    if (lastName.value.length == 0 || lastName.value == '') {
      lastName.message = ErrorMessage.lastNameRequired;
      lastName.isValid = false;
    } else if (!validateName(lastName.value)) {
      lastName.message = ErrorMessage.lastNameInvalid;
      lastName.isValid = false;
    } else {
      lastName.message = '';
      lastName.isValid = true;
    }
    this.setState({
      lastName,
    });
  };

  onCompanyNameChange = text => {
    const companyName = this.state.companyName;
    companyName.value = text;

    if (companyName.value.length == 0 || companyName.value == '') {
      companyName.message = ErrorMessage.companyNameRequired;
      companyName.isValid = false;
    } else {
      companyName.message = '';
      companyName.isValid = true;
    }
    this.setState({
      companyName,
    });
  };

  onTradingNameChange = text => {
    const tradingName = this.state.tradingName;
    tradingName.value = text;

    if(tradingName.value.length == 0 || tradingName.value == ''){
      tradingName.message = ErrorMessage.companyNameRequiredl
    }else{
      tradingName.message = '';
      tradingName.isValid = true;
    }
    this.setState({
      tradingName
    })
  }

  isSubmitDisable() {
    if (this.state.sAccountType?.toLowerCase() == 'business') {
      return (
        !this.state.firstName.isValid ||
        !this.state.lastName.isValid ||
        !this.state.email.isValid ||
        !this.state.phoneNumber.isValid ||
        !this.state.dDateofBirth ||
        _calculateAge(this.state.dateObj) < 16 ||
        !this.state.companyName.isValid ||
        !this.state.companyEmail.isValid
      );
    } else {
      return (
        !this.state.firstName.isValid ||
        !this.state.lastName.isValid ||
        !this.state.email.isValid ||
        !this.state.phoneNumber.isValid ||
        !this.state.dDateofBirth ||
        _calculateAge(this.state.dateObj) < 16
      );
    }
  }

  // getAccountType = async () => {
  //   let userData = JSON.parse(await getStoredData(Globals.kUserData));
  //   if (Globals.isClient) {
  //     return Accounts.NATURAL;
  //   } else {
  //     return this.state.isSoleTrader
  //       ? Accounts.SOLE_TRADER
  //       : Accounts.BUSINESS;
  //   }
  // };

  onNextClick = async () => {
    let {
      firstName,
      lastName,
      tradingName,
      dDateofBirth,
      isBuilder,
      countryRes,
      email,
      phoneNumber,
      nationality,
      countryCode,
      companyName, companyEmail
    } = this.state;

    this.setState({
      isLoading: true
    })

    try {
      let sProfilePic = {};

      if (this.state.userPhoto.path) {
        sProfilePic.uri = this.state.userPhoto.path;
        sProfilePic.type = 'image/jpeg';
        sProfilePic.name = 'profilePic.jpg';
      }
      const { screenProps } = this.props;
      if (!screenProps.isConnected) {
        return
      }
      let request = new FormData();
      let userData = JSON.parse(await getStoredData(Globals.kUserData))

      let isBusiness = this.state.sAccountType.toLowerCase() == "business"
      let companyObj = userData.oCompanyDetail || {}
      let legalDetails = userData.oLegalRepresentativeDetail || {}

      request.append("userId", Globals.userId);
      request.append('sFirstName', firstName.value);
      request.append('sLastName', lastName.value);
      request.append('sEmail', email.value.toLocaleLowerCase());
      request.append('nPhoneNumber', phoneNumber.value);
      request.append('nCountryCode', countryCode);
      tradingName.value != '' && request.append('tradingName', tradingName.value);

      if (isBusiness) {
        companyObj['sCompanyName'] = companyName.value
        companyObj['sCompanyEmail'] = companyEmail.value
        legalDetails['sFirstName'] = firstName.value
        legalDetails['sLastName'] = lastName.value
        legalDetails['dDob'] = moment(this.state.dateObj).format("YYYY-MM-DD")
        legalDetails['sEmail'] = email.value
        legalDetails['sNationality'] = nationality.toUpperCase()
        legalDetails['sCountry'] = countryRes
        request.append("isLastStep", JSON.stringify(true));
        request.append("sCountryOfResidence", countryRes);
        request.append("oLegalRepresentativeDetail", JSON.stringify(legalDetails));
        request.append("oCompanyDetail", JSON.stringify(companyObj));
        // request.append('sAccountType', 'BUSINESS');
        request.append('sAccountType', 'Business');
      } else {
        this.state.dateObj ? request.append('dDateofBirth', moment(this.state.dateObj).format('YYYY-MM-DD')) :
          dDateofBirth && request.append('dDateofBirth', dDateofBirth);
        request.append('sNationality', nationality.toUpperCase());
        request.append('sCountryOfResidence', countryRes);
        // request.append("isLastStep", JSON.stringify(true));
        // request.append('sAccountType', 'NATURAL');
        request.append('sAccountType', 'Individual');
      }

      console.log('update profile request====>', request);

      if (Object.keys(sProfilePic).length != 0) {
        request.append('sProfilePic', sProfilePic);
      }
      let response = !isBusiness ? await API.editProfileIndividual(request) : await API.editProfileBusiness(request);

      // let response = await API.editProfileIndividual(request)
      console.log('response', response);
      this.setState({ isLoading: false });
      if (response.status) {
        await setStoredData(Globals.kUserData, JSON.stringify(response.data));
        Globals.userId = response.data._id;
        Globals.countryCode = response.data.nCountryCode;
        Globals.sAccountType = response.data.sAccountType
        Globals.isBuilder =
          response.data._UserRoleId == Users.BUILDER ? true : false;
        Globals.isProfileCompleted = response.data.isProfileCompleted;

        if (!this.state.fromProfilePage) {
          screenProps.callback({ status: true, msg: 'Your profile has been saved successfully.' })
          // setTimeout(() => {
          //   afterSuccessLogin(this.props, response.data, this.state.fromProfilePage)
          // }, 1000);
        } else {
          afterSuccessLogin(this.props, response.data, this.state.fromProfilePage)
        }

      } else {
        // screenProps.callback(response)
      }
      this.props.navigation.navigate(
        isBusiness ? Routes.LegalInformation : Routes.Contact_Information,
      );

    } catch (error) {
      console.log('editProfile error', error.message);
      this.setState({ isLoading: false });
    }
  };
}
