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
  Image,
  Modal,
  TouchableOpacity,
  Alert,
  Text
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

export default class UboPersonDetails extends Component {
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
      uboCounter: 0
    };
  }

  componentDidMount() {
    this.getUserData();
  }

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

  getUserData = () => {
    getStoredData(Globals.kUserData).then(value => {
      let result = JSON.parse(value);
      console.log('PersonalInformation UserData', result);
      if (result) {
        let uboPerson = result.uboPerson
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

        } = this.state;

        let has25share = result.has25share
        let has75share = result.has75share

        let uboCounter = result.uboPerson.length
        // if (uboPerson) {
        //   firstName['value'] = uboPerson.FirstName || ''
        //   firstName['isValid'] = uboPerson.FirstName != ''

        //   lastName['value'] = uboPerson.LastName || ''
        //   lastName['isValid'] = uboPerson.LastName != ''

        //   dDateofBirth['value'] = uboPerson.Birthday ? new Date(uboPerson.Birthday) : ''
        //   dDateofBirth['isValid'] = uboPerson.Birthday != ''

        //   if (uboPerson.Nationality) {
        //     nationality['value'] = uboPerson.Nationality || ''
        //     nationality['name'] = 'United Kingdom'
        //     nationality['isValid'] = uboPerson.Nationality != ''
        //   }

        //   birthCity['value'] = uboPerson.Birthplace.City || ''
        //   birthCity['isValid'] = uboPerson.Birthplace.City != ''

        //   if (uboPerson.Birthplace.Country) {
        //     birthCountry['value'] = uboPerson.Birthplace.Country || ''
        //     birthCountry['name'] = 'United Kingdom'
        //     birthCountry['isValid'] = uboPerson.Birthplace.Country != ''
        //   }

        //   addLine1['value'] = uboPerson.address.AddressLine1 || ''
        //   addLine1['isValid'] = uboPerson.address.AddressLine1 != ''

        //   addLine2['value'] = uboPerson.address.AddressLine2 || ''
        //   addLine2['isValid'] = uboPerson.address.AddressLine1 != ''

        //   if (uboPerson.address) {
        //     city['value'] = uboPerson.address.City || ''
        //     city['isValid'] = uboPerson.address.City != ''

        //     region['value'] = uboPerson.address.Region || ''
        //     region['isValid'] = uboPerson.address.Region != ''

        //     if (uboPerson.address.Country) {
        //       country['value'] = uboPerson.address.Country || ''
        //       country['name'] = 'United Kingdom'
        //       country['isValid'] = uboPerson.address.Country != ''
        //     }

        //     postalcode['value'] = uboPerson.address.PostalCode || ''
        //     postalcode['isValid'] = uboPerson.address.PostalCode != ''
        //   }

        // }

        this.setState({
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
          has25share, has75share, uboCounter,
          isProfileCompleted: uboCounter === 3
        })
      }
    });
  };

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

  renderUBOform() {
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
      <SafeAreaView style={styles.safeVStyle}>
        <KeyboardAwareScrollView>
          <View style={styles.informationDetails}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
              <Label style={{ paddingLeft: 100 }} fontSize_16 Montserrat_Medium color={Color.BLACK}>UBO Declaration {uboCounter}</Label>
              <HeaderRight
                buttonTitle="Cancel"
                onPress={() => this.setState({ showUboForm: false })}
              />
            </View>

            <View style={styles.borderLine} />
            <View style={{ width: Globals.isIpad ? 400 : '100%' }}>
              <TextField
                placeholder="First Name"
                LabelTitle="First Name"
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
              </TextField>
              <View style={{ zIndex: -1 }}>
                <TextField
                  placeholder="Last Name"
                  LabelTitle="Last Name"
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
                </TextField>
              </View>
              <View style={{ zIndex: -11 }}>
                <Label fontSize_16 color={Color.DarkGrey} mb={10}>
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
                <DropDownCustom type='nationality' value={nationality.name} labelTitle='Nationality' Title='Select Nationality' options={[]}
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
                <TextField
                  placeholder="Birth City"
                  LabelTitle="Birth City"
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
                </TextField>
              </View>
              <View style={{ zIndex: -11111 }}>
                <DropDownCustom type='country' value={birthCountry.name} labelTitle='Birth Country' Title='Select Birth Country' options={[]}
                  onOptionChange={(country) => {
                    console.log("Country", country.iso2)
                    this.setState({ birthCountry: { value: country.iso2, name: country.name, isValid: true } })
                  }} >
                </DropDownCustom>
              </View>
              <View style={{ zIndex: -111111 }}>
                <TextField
                  placeholder='Address Line 1'
                  LabelTitle='Address Line 1'
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
                <TextField
                  placeholder='Address Line 2'
                  LabelTitle='Address Line 2'
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
                <TextField
                  placeholder='Enter City'
                  LabelTitle='City'
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
                <TextField
                  placeholder='Region'
                  LabelTitle='Region'
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
                <DropDownCustom type='country' value={country.name} labelTitle='Country' Title='Select Country' options={[]}
                  onOptionChange={(country) => {
                    console.log("Country", country.iso2)
                    // this.postalInput.refs.postalRef.focus();

                    this.setState({ country: { value: country.iso2, name: country.name, isValid: true } })
                  }} >
                </DropDownCustom>
              </View>
              <View style={{ zIndex: -1111111111 }}>
                <TextField
                  placeholder="Enter Postal Code"
                  LabelTitle="Postal Code"
                  onChangeText={(text) => this.handleUserInput('postalcode', text)}
                  value={postalcode.value}
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
      </SafeAreaView >
    )
  }

  render() {
    let { showUboForm } = this.state
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeVStyle}>
          <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
            <Label ml={5} mb={10} fontSize_16 Montserrat_Medium color={Color.DarkGrey}>Do you own more than 75% of the company?</Label>
            {/* <Label fontSize_16 Montserrat_Medium color={Color.BLACK}> Do you own over 75% of this company? </Label> */}
            <RadioButton
              // disabled={this.state.isProfileCompleted}
              title={'YES'}
              textStyle={{ fontSize: fontNormal20, fontFamily: 'Montserrat-Medium' }}
              onChange={() => this.setState({ has75share: true })}
              selected={this.state.has75share} />
            <RadioButton
              // disabled={this.state.isProfileCompleted}
              title={'NO'}
              textStyle={{ fontSize: fontNormal20, fontFamily: 'Montserrat-Medium' }}
              onChange={() => this.setState({ has75share: false })}
              selected={this.state.has25share} />
          </View>

          <KMButton
            onPress={() => {
              if (this.state.has25share) {
                this.props.navigation.navigate(Routes.EditBusinessUBO1);
              } else {
                this.props.navigation.navigate(Routes.Financial_Information);
              }
            }}
            fontSize_16
            Montserrat_Medium
            color={Color.BLACK}
            title="NEXT"
            textStyle={{ padding: 0 }}
            style={{
              zIndex: -1111,
              backgroundColor: this.state.has25share == undefined && this.state.has75share == undefined
                ? Color.GreyLightColor
                : Color.Yellow,
              marginTop: 20,
              marginBottom: 40,
              width: Globals.isIpad ? 400 : '92%',
              alignItems: 'center',
              justifyContent: 'center',
              height: 48,
              alignSelf: "center"
            }}
            disabled={this.state.has25share == undefined && this.state.has75share == undefined}
          />
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate(Routes.Financial_Information);
          }} style={{ marginTop: -20, marginBottom: 20 }}>
            <Label style={{ textAlign: 'center' }} fontSize_16 color={Color.DarkBlue} Montserrat_Medium>SKIP</Label>
          </TouchableOpacity>

          {this.state.isLoading && <ProgressHud />}

          <Modal
            animationType="slide"
            // transparent={true}
            visible={showUboForm}
          >
            {this.renderUBOform()}
            {/* <Label fontSize_16 Montserrat_Medium color={Color.BLACK}> Do you own over 75% of this company? </Label> */}

          </Modal>

        </SafeAreaView>
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
      !this.state.city.isValid ||
      !this.state.region.isValid ||
      !this.state.country.isValid ||
      !this.state.postalcode.isValid
    );
  }

  onNextClick = () => {
    this.addUBO()
  }

  async addUBO() {
    let { has75share, has25share } = this.state
    let userData = JSON.parse(await getStoredData(Globals.kUserData));
    if (has25share) {
      /* when user has 25% share, 1 ubo is legal person and user will add another 2 */
      let legalPerson = userData.oLegalRepresentativeDetail
      await this.onAddUBO(legalPerson)
    } else if (has75share) {
      /* when user has 75% share, ubo is legal person */
      let legalPerson = userData.oLegalRepresentativeDetail
      await this.onAddUBO(legalPerson)
    } else {
      /* when user has no share,user will add 3 users */
      this.handleUboForm()
    }
  }

  onAddUBO = async (legalPerson) => {
    const { screenProps } = this.props;
    if (!screenProps.isConnected) {
      return
    }

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
      has25share, has75share
    } = this.state;

    let userData = await getStoredData(Globals.kUserData);
    let uboPerson = {}

    has75share != undefined && (uboPerson['has75share'] = has75share)
    has25share != undefined && (uboPerson['has25share'] = has25share)

    if (legalPerson) {
      uboPerson['sFirstName'] = legalPerson.sFirstName
      uboPerson['sLastName'] = legalPerson.sLastName
      uboPerson['sNationality'] = legalPerson.sNationality
      uboPerson['sBirthday'] = legalPerson.dDob
      uboPerson['oAddress'] = JSON.stringify(legalPerson.address)
      uboPerson['oBirthplace'] = JSON.stringify({
        City: legalPerson.address.City,
        Country: legalPerson.address.Country
      })
    } else {
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
    }

    try {
      console.log('add uboPerson request====>', uboPerson);
      let formData = getFormDataObj(uboPerson)

      let response = await API.addUBO(formData);
      console.log('addUBO response', response);

      this.setState({ isLoading: false, });

      if (response.status) {
        if (response.data) {
          let userData = JSON.parse(await getStoredData(Globals.kUserData))
          await setStoredData(Globals.kUserData, JSON.stringify(response.data));
          Globals.userId = response.data._id;
          Globals.countryCode = response.data.nCountryCode;
          Globals.isBuilder = response.data._UserRoleId == Users.BUILDER ? true : false;
        }
        this.handleUboForm()

      } else {
        screenProps.callback(response)
      }
    } catch (error) {
      console.log('addUBO error', error.message);
      this.setState({ isLoading: false });
    }

  };

  handleUboForm = () => {
    let { has25share, uboCounter } = this.state
    if (has25share === true && uboCounter < 2) {
      uboCounter++;
      this.setState({ showUboForm: true, uboCounter }, this.initialForm)
    } else if (has25share === false && uboCounter < 3) {
      uboCounter++;
      this.setState({ showUboForm: true, uboCounter }, this.initialForm)
    } else {
      this.setState({ showUboForm: false })
      this.props.navigation.navigate(Routes.Financial_Information)
    }
  }
}
