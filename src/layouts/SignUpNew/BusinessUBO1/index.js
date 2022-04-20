/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import CheckBox from "react-native-check-box";

import Label from '../../../components/Label';
import Color from '../../../utils/color';
import LocalImages from '../../../utils/LocalImages';
import styles from './styles';
import Globals, {
  isValidValue,
  Users,
  getCountryFromIso,
  getFormDataObj,
  afterSuccessLogin,
  _calculateAge,
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
import { Routes } from '../../../utils/Routes';

import DatePicker from 'react-native-datepicker';

import { getStoredData, setStoredData } from '../../../utils/store';
import { fontXSmall16, screenWidth, fontLarge24, fontNormal20 } from '../../../utils/theme';
import { validateEmail, validatePostalcode } from '../../../utils/validation'
import moment from 'moment';
import SignatureCapture from 'react-native-signature-capture';
import ImagePicker from 'react-native-image-crop-picker';
import CustomIcon from '../../../components/CustomIcon';
import DropDownCustom from '../../../components/DropDown';
import API from '../../../API';
import ProgressHud from '../../../components/ProgressHud';
import RadioButton from '../../../components/RadioButton';
import TextFieldInput from '../../../components/TextFieldInput';

export default class BusinessUBO1 extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <HeaderLeft
        iconName="left-arrow"
        onPress={() => {
          navigation.goBack();
        }}
      />,
      headerTitle: () => <HeaderTitle title={'Edit Profile'} />,
      headerRight: (
        // <HeaderRight
        //   buttonTitle="Cancel"
        //   onPress={() => {
        //     navigation.goBack();
        //   }}
        // />
        null
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
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
      dDateofBirth: {
        value: '',
        message: '',
        isValid: false,
      },
      nationality: {
        value: Globals.countryIso,
        name: Globals.nationalityName,
        message: '',
        isValid: true,
      },
      birthCity: {
        value: '',
        message: '',
        isValid: false,
      },
      birthCountry: {
        value: 'GB',
        name: 'United Kingdom',
        message: '',
        isValid: true,
      },
      addLine1: {
        value: '',
        message: '',
        isValid: false,
      },
      addLine2: {
        value: '',
        message: '',
        isValid: false,
      },
      city: {
        value: '',
        message: '',
        isValid: false,
      },
      region: {
        value: '',
        message: '',
        isValid: false,
      },
      country: {
        value: 'GB',
        name: 'United Kingdom',
        message: '',
        isValid: true,
      },
      postalcode: {
        value: '',
        message: '',
        isValid: false,
      },
      // street: "",
      countryCode: Globals.countryCode,
      maxDate: new Date(),
      // dDateofBirth: "",
      isShowSignView: false,
      has75share: undefined,
      has25share: undefined,
      showUboForm: false,
      uboCounter: 0,
      isLoading: false
    };
  }

  // componentDidMount() {
  //   this.getUserData();
  // }

  initialForm() {
    this.setState({
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
      dDateofBirth: {
        value: '',
        message: '',
        isValid: false,
      },
      nationality: {
        value: Globals.countryIso,
        name: Globals.nationalityName,
        message: '',
        isValid: true,
      },
      birthCity: {
        value: '',
        message: '',
        isValid: false,
      },
      birthCountry: {
        value: 'GB',
        name: 'United Kingdom',
        message: '',
        isValid: true,
      },
      addLine1: {
        value: '',
        message: '',
        isValid: false,
      },
      addLine2: {
        value: '',
        message: '',
        isValid: false,
      },
      city: {
        value: '',
        message: '',
        isValid: false,
      },
      region: {
        value: '',
        message: '',
        isValid: false,
      },
      country: {
        value: 'GB',
        name: 'United Kingdom',
        message: '',
        isValid: true,
      },
      postalcode: {
        value: '',
        message: '',
        isValid: false,
      },
    })
  }


  handleUserInput(refs, text) {
    let state = {}
    let value = ''
    let isValid = false
    let message = ''

    switch (refs) {
      case 'firstName':
        value = text
        isValid = text.length > 0 && validateName(text)
        message = !isValid ? (text.length <= 0 ? ErrorMessage.firstNameRequired : ErrorMessage.firstNameInvalid) : ''
        break;
      case 'lastName':
        value = text
        isValid = text.length > 0 && validateName(text)
        message = !isValid ? (text.length <= 0 ? ErrorMessage.lastNameRequired : ErrorMessage.lastNameInvalid) : ''
        break;
      case 'dDateofBirth':
        isValid = text && _calculateAge(new Date(text)) > 16
        isValid && (value = text)
        message = !isValid ? (text == undefined ? ErrorMessage.dateOfBirthRequired : ErrorMessage.dateOfBirthInvalid) : ''
        break;
      case 'birthCity':
        value = text
        isValid = text.length > 0
        message = !isValid ? ErrorMessage.birthCityRequired : ''
        break;
      case 'addLine1':
        value = text
        isValid = text.length > 0
        message = !isValid ? (ErrorMessage.addressLine1Required) : ''
        break;
      case 'addLine2':
        value = text
        isValid = text.length > 0
        message = !isValid ? (ErrorMessage.addressLine1Required) : ''
        break;

      case 'city':
        value = text
        isValid = text.length > 0
        message = !isValid ? ErrorMessage.CityRequired : ''
        break;
      case 'region':
        value = text
        isValid = text.length > 0
        message = !isValid ? ErrorMessage.RegionRequired : ''
        break;
      case 'postalcode':
        value = text
        isValid = text.length > 0 && validatePostalcode(text)
        message = !isValid ? (text.length <= 0 ? ErrorMessage.postalcodeRequired : ErrorMessage.postalcodeInvalid) : ''
        break;
      default:
        break;
    }
    state[refs] = { value, isValid, message }
    this.setState(state)
  }

  render() {
    const {
      firstName,
      lastName,
      dDateofBirth,
      nationality,
      birthCity,
      birthCountry,
      addLine1,
      addLine2,
      city,
      region,
      country,
      postalcode,
      maxDate, uboCounter
    } = this.state;
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeVStyle}>
          <View style={GlobalStyles.topCustomHeader}>
            <HeaderLeft
              iconName="left-arrow"
              onPress={() => {
                this.props.navigation.goBack();
              }}
            />
            <HeaderTitle title={'Second person owning more than 25%'} />
            <HeaderRight />
          </View>
          <KeyboardAwareScrollView>
            <View style={styles.informationDetails}>
              <View style={{ width: Globals.isIpad ? 400 : '100%' }}>

                {/* <Label
                  mb={10}
                  fontSize_16
                  Montserrat_Medium
                  color={Color.DarkGrey}>
                  Second person owning more than 25%
                </Label> */}

                <TextFieldInput
                  placeholder="First Name"
                  LabelTitle="First Name"
                  customStyle={GlobalStyles.textFieldStyle}
                  onChangeText={(text) => this.handleUserInput('firstName', text)}
                  value={firstName.value}
                  autoFocus={true}>
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
                </TextFieldInput>
                <View style={{ zIndex: -1 }}>
                  <TextFieldInput
                    placeholder="Last Name"
                    LabelTitle="Last Name"
                    customStyle={GlobalStyles.textFieldStyle}
                    onChangeText={(text) => this.handleUserInput('lastName', text)}
                    value={lastName.value}>
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
                  </TextFieldInput>
                </View>
                <View style={{ zIndex: -11 }}>
                  <Label fontSize_20 color={Color.DarkGrey} mb={10}>
                    Date of Birth
                  </Label>
                  <DatePicker
                    disabled={this.state.profileComplete}
                    style={{
                      width: Globals.isIpad ? 400 : screenWidth - 30,
                      marginBottom: 20,
                    }}
                    date={dDateofBirth.value}
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
                        fontSize: fontLarge24,
                        color: Color.DarkGrey,
                        fontFamily: 'Montserrat-Regular',
                      },
                      placeholderText: {
                        fontFamily: 'Montserrat-Regular',
                        fontSize: fontLarge24,
                      },
                      dateInput: {
                        marginLeft: 0,
                        borderRadius: 4,
                        height: 48,
                        alignItems: 'flex-start',
                        borderColor: Color.LightGrey,
                        fontFamily: 'Montserrat-Regular',
                        fontSize: fontLarge24,
                        borderWidth: 0,
                        borderBottomWidth: 1
                      },
                    }}
                    onDateChange={(date, dateObj) => this.handleUserInput('dDateofBirth', dateObj)}
                  />

                  {dDateofBirth.message != '' && (
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
                        {dDateofBirth.message}
                      </Label>
                    </View>
                  )}
                </View>
                <View style={{ zIndex: -111 }}>
                  <DropDownCustom
                    drodDownPropsTxt={{
                      paddingLeft: 0, flex: 1, fontFamily: 'Montserrat-Regular',
                      fontSize: fontLarge24,
                    }}
                    isNewTitle={true}
                    dropDownPropsContainer={{ borderWidth: 0, borderBottomWidth: 1, marginBottom: 10, color: 'red' }}
                    type='nationality' value={nationality.name} labelTitle='Nationality' Title='Select Nationality' options={[]}
                    onOptionChange={(country) => {
                      console.log("Country", country.iso2)
                      this.setState({
                        nationality: {
                          value: country.iso2,
                          name: country.nationality,
                          isValid: true
                        }
                      })
                    }} >
                  </DropDownCustom>
                </View>
                <View style={{ zIndex: -1111 }}>
                  <TextFieldInput
                    placeholder="Birth City"
                    LabelTitle="Birth City"
                    customStyle={GlobalStyles.textFieldStyle}
                    onChangeText={(text) => this.handleUserInput('birthCity', text)}
                    value={birthCity.value}>
                    {birthCity.message !== '' && (
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
                          {birthCity.message}
                        </Label>
                      </View>
                    )}
                  </TextFieldInput>
                </View>
                <View style={{ zIndex: -11111 }}>
                  <DropDownCustom
                    drodDownPropsTxt={{
                      paddingLeft: 0, flex: 1, fontFamily: 'Montserrat-Regular',
                      fontSize: fontLarge24,
                    }}
                    isNewTitle={true}
                    dropDownPropsContainer={{ borderWidth: 0, borderBottomWidth: 1, marginBottom: 10 }}
                    type='country' value={birthCountry.name} labelTitle='Birth Country' Title='Select Birth Country' options={[]}
                    onOptionChange={(country) => {
                      console.log("Country", country.iso2)
                      this.setState({ birthCountry: { value: country.iso2, name: country.name, isValid: true } })
                    }} >
                  </DropDownCustom>
                </View>
                <View style={{ zIndex: -111111 }}>
                  <TextFieldInput
                    placeholder='House Name/Number'
                    LabelTitle='House Name/Number'
                    customStyle={GlobalStyles.textFieldStyle}
                    onChangeText={(text) => this.handleUserInput('addLine1', text)}
                    value={addLine1.value}
                    returnKeyType={"next"}
                    onSubmitEditing={() => this.address2Input.refs.address2Ref.focus()}

                  />
                  {addLine1.message !== "" &&
                    <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                      <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                      <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{addLine1.message}</Label>
                    </View>
                  }
                </View>
                <View style={{ zIndex: -1111111 }}>
                  <TextFieldInput
                    placeholder='Address Line 1'
                    LabelTitle='Address Line 1'
                    customStyle={GlobalStyles.textFieldStyle}
                    onChangeText={(text) => this.handleUserInput('addLine2', text)}
                    value={addLine2.value}
                    ref={ref => this.address2Input = ref}
                    reference='address2Ref'
                    returnKeyType={"next"}
                    onSubmitEditing={() => this.cityInput.refs.cityRef.focus()}
                  />
                  {addLine2.message !== "" &&
                    <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                      <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                      <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{addLine2.message}</Label>
                    </View>
                  }
                </View>
                <View style={{ zIndex: -11111111 }}>
                  <TextFieldInput
                    placeholder='Enter City'
                    LabelTitle='City'
                    customStyle={GlobalStyles.textFieldStyle}
                    onChangeText={(text) => this.handleUserInput('city', text)}
                    value={city.value}
                    ref={ref => this.cityInput = ref}
                    reference='cityRef'
                    returnKeyType={"next"}
                    onSubmitEditing={() => this.regionInput.refs.regionRef.focus()}
                  />
                  {city.message !== "" &&
                    <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                      <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                      <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{city.message}</Label>
                    </View>
                  }
                </View>
                <View style={{ zIndex: -111111111 }}>
                  <TextFieldInput
                    placeholder='Region'
                    LabelTitle='Region'
                    customStyle={GlobalStyles.textFieldStyle}
                    onChangeText={(text) => this.handleUserInput('region', text)}
                    value={region.value}
                    ref={ref => this.regionInput = ref}
                    reference='regionRef'
                    returnKeyType={"next"}
                  />
                  {region.message !== "" &&
                    <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                      <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                      <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{region.message}</Label>
                    </View>
                  }
                </View>
                <View style={{ zIndex: -1111111111 }}>
                  <DropDownCustom
                    drodDownPropsTxt={{
                      paddingLeft: 0, flex: 1, fontFamily: 'Montserrat-Regular',
                      fontSize: fontLarge24,
                    }}
                    isNewTitle={true}
                    dropDownPropsContainer={{ borderWidth: 0, borderBottomWidth: 1, marginBottom: 10 }}
                    type='country' value={country.name} labelTitle='Country' Title='Select Country' options={[]}
                    onOptionChange={(country) => {
                      console.log("Country", country.iso2)
                      // this.postalInput.refs.postalRef.focus();
                      this.setState({ country: { value: country.iso2, name: country.name, isValid: true } })
                    }} >
                  </DropDownCustom>
                </View>
                <View style={{ zIndex: -1111111111 }}>
                  <TextFieldInput
                    placeholder="Enter Postal Code"
                    customStyle={GlobalStyles.textFieldStyle}
                    LabelTitle="Postal Code"
                    onChangeText={(text) => this.handleUserInput('postalcode', text)}
                    value={postalcode.value}
                    keyboardType=""
                  />
                  {postalcode.message !== '' && (
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
                        {postalcode.message}
                      </Label>
                    </View>
                  )}
                </View>
              </View>

              <KMButton
                onPress={() => this.onAddUBO()}
                fontSize_16
                Montserrat_Medium
                color={Color.BLACK}
                title="Save & Add UBO"
                textStyle={{ padding: 0 }}
                style={{
                  zIndex: -1111,
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
          </KeyboardAwareScrollView>

          {this.state.isLoading && <ProgressHud />}
        </SafeAreaView >

      </View >
    );
  }

  isSubmitDisable() {
    return (
      !this.state.firstName.isValid ||
      !this.state.lastName.isValid ||
      !this.state.dDateofBirth.isValid ||
      !this.state.nationality.isValid ||
      !this.state.birthCity.isValid ||
      !this.state.birthCountry.isValid ||
      !this.state.addLine1.isValid ||
      !this.state.addLine2.isValid ||
      !this.state.city.isValid ||
      !this.state.region.isValid ||
      !this.state.country.isValid ||
      !this.state.postalcode.isValid
    );
  }


  // UBO Call ::


  onAddUBO = async () => {
    this.setState({
      isLoading: true
    })
    const { screenProps } = this.props;
    let {
      firstName,
      lastName,
      dDateofBirth,
      nationality,
      birthCity,
      birthCountry,
      addLine1,
      addLine2,
      city,
      region,
      country,
      postalcode,
    } = this.state;

    if (!screenProps.isConnected) {
      return
    }

    let uboPerson = {}


    uboPerson['currentStep'] = Routes.BusinessUBO2
    uboPerson['uboType'] = "ubo1"

    uboPerson['has75share'] = false
    uboPerson['has25share'] = true
    uboPerson['sFirstName'] = firstName.value.trim()
    uboPerson['sLastName'] = lastName.value.trim()
    uboPerson['sNationality'] = nationality.value.toUpperCase()
    uboPerson['sBirthday'] = moment(new Date(dDateofBirth.value)).format('YYYY-MM-DD')
    uboPerson['oAddress'] = JSON.stringify({
      AddressLine1: addLine1.value.trim(),
      AddressLine2: addLine2.value && addLine2.value !== '' ? addLine2.value.trim() : undefined,
      City: city.value.trim(),
      Region: region.value.trim(),
      PostalCode: postalcode.value.trim(),
      Country: country.value.toUpperCase(),
    })

    uboPerson['oBirthplace'] = JSON.stringify({
      City: birthCity.value.trim(),
      Country: birthCountry.value.toUpperCase()
    })


    try {
      console.log('add uboPerson request====>', uboPerson);
      let formData = getFormDataObj(uboPerson)
      let response = await API.addUBO(formData);
      console.log('addUBO response', response);

      this.setState({ isLoading: false, });

      if (response.status) {
        if (response.data) {
          await setStoredData(Globals.kUserData, JSON.stringify(response.data));
          Globals.userId = response.data._id;
          Globals.countryCode = response.data.nCountryCode;
          Globals.isBuilder = response.data._UserRoleId == Users.BUILDER ? true : false;
          this.props.navigation.navigate(Routes.BusinessUBO2)
        }
      } else {
        screenProps.callback(response)
      }
    } catch (error) {
      console.log('addUBO error', error.message);
      this.setState({ isLoading: false });
    }

  };

}
