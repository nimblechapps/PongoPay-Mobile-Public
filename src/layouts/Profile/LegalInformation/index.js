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
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Label from '../../../components/Label';
import Color from '../../../utils/color';
import LocalImages from '../../../utils/LocalImages';
import styles from './styles';
import CheckBox from 'react-native-check-box';

import Globals, {
  isValidValue,
  Users,
  Accounts,
  getCountryFromIso,
  _calculateAge,
} from '../../../utils/Globals';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateCharacter, validatePostalcode } from '../../../utils/validation';
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

const ProfileOptions = ['Sole trader', 'Business'];
export default class LegalInformation extends Component {
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
      maxDate: new Date(),
      isShowSignView: false,
      isSoleTrader: true,
      isBuilder: Globals.isBuilder,
      companyNumber: {
        value: "",
        message: "",
        isValid: false,
      },
      companyAddress: {
        addressLine1: {
          value: "",
          message: "",
          isValid: false,
        },
        addressLine2: {
          value: "",
          message: "",
          isValid: false,
        },
        region: {
          value: "",
          message: "",
          isValid: false,
        },
        city: {
          value: "",
          message: "",
          isValid: false,
        },
        postalcode: {
          value: "",
          message: "",
          isValid: false,
        },
      },
      address: {
        addressLine1: {
          value: "",
          message: "",
          isValid: false,
        },
        addressLine2: {
          value: "",
          message: "",
          isValid: false,
        },
        region: {
          value: "",
          message: "",
          isValid: false,
        },
        city: {
          value: "",
          message: "",
          isValid: false,
        },
        postalcode: {
          value: "",
          message: "",
          isValid: false,
        },
      }
    };
  }

  getUserData = () => {
    getStoredData(Globals.kUserData).then(response => {
      let result = JSON.parse(response)
      let oLegalRepresentativeDetail = result.oLegalRepresentativeDetail.address
      let oCompanyAddress = result.oCompanyAddress
      let { address, companyAddress, companyNumber } = this.state

      if (oLegalRepresentativeDetail) {
        address.addressLine1.value = oLegalRepresentativeDetail.AddressLine1 ? oLegalRepresentativeDetail.AddressLine1 : ""
        address.addressLine1.isValid = isValidValue(oLegalRepresentativeDetail.AddressLine1)


        address.addressLine2.value = oLegalRepresentativeDetail.AddressLine2 ? oLegalRepresentativeDetail.AddressLine2 : ""
        address.addressLine2.isValid = isValidValue(oLegalRepresentativeDetail.AddressLine2)

        address.region.value = oLegalRepresentativeDetail.City ? oLegalRepresentativeDetail.City : ""
        address.region.isValid = isValidValue(oLegalRepresentativeDetail.City)

        address.city.value = oLegalRepresentativeDetail.Region ? oLegalRepresentativeDetail.Region : ""
        address.city.isValid = isValidValue(oLegalRepresentativeDetail.Region)

        address.postalcode.value = oLegalRepresentativeDetail.PostalCode ? oLegalRepresentativeDetail.PostalCode : ""
        address.postalcode.isValid = isValidValue(oLegalRepresentativeDetail.PostalCode)

        // const countryCode = isValidValue(companyAddress.Country) ? companyAddress.Country : Globals.countryCode
      }

      if (oCompanyAddress) {
        companyAddress.addressLine1.value = oCompanyAddress.AddressLine1 ? oCompanyAddress.AddressLine1 : ""
        companyAddress.addressLine1.isValid = isValidValue(oCompanyAddress.AddressLine1)


        companyAddress.addressLine2.value = oCompanyAddress.AddressLine2 ? oCompanyAddress.AddressLine2 : ""
        companyAddress.addressLine2.isValid = isValidValue(oCompanyAddress.AddressLine2)

        companyAddress.region.value = oCompanyAddress.City ? oCompanyAddress.City : ""
        companyAddress.region.isValid = isValidValue(oCompanyAddress.City)

        companyAddress.city.value = oCompanyAddress.Region ? oCompanyAddress.Region : ""
        companyAddress.city.isValid = isValidValue(oCompanyAddress.Region)

        companyAddress.postalcode.value = oCompanyAddress.PostalCode ? oCompanyAddress.PostalCode : ""
        companyAddress.postalcode.isValid = isValidValue(oCompanyAddress.PostalCode)

        // const countryCode = isValidValue(companyAddress.Country) ? companyAddress.Country : Globals.countryCode
      }

      if (result.oCompanyDetail) {
        companyNumber.value = result.oCompanyDetail.sCompanyNumber
        companyNumber.isValid = isValidValue(result.oCompanyDetail.sCompanyNumber)
      }

      this.setState({
        companyAddress, address, companyNumber
      })
    })
  }


  handleUserInput(parentRefs, refs, text) {
    let state = this.state
    let value = text
    let isValid = false
    let message = ''
    switch (refs) {
      case 'addressLine1':
        isValid = text.length > 0
        message = !isValid ? ErrorMessage.addressRequired : ''
        break;
      case 'addressLine2':
        isValid = text.length > 0
        message = !isValid ? ErrorMessage.addressRequired : ''
        break;     
      case 'city':
        isValid = text.length > 0
        message = !isValid ? ErrorMessage.CityRequired : ''
        break;
      case 'region':
        isValid = text.length > 0
        message = !isValid ? ErrorMessage.regionRequired : ''
        break;
      case 'postalcode':
        isValid = text.length > 0 && validatePostalcode(text)
        message = !isValid ? (text.length <= 0 ? ErrorMessage.postalcodeRequired : ErrorMessage.postalcodeInvalid) : ''
        break;
        
      default:
        break;
    }
    state[parentRefs][refs] = { value, isValid, message }
    this.setState(state)
  }

  onCompanyNumberChange = (text) => {
    this.setState({
      companyNumber: {
        value: text,
        message: '',
        isValid: true
      }
    })
  }

  setAddress = () => {
    let { companyAddress, address } = this.state
    if (this.state.sameAddress) {
      for (const key in companyAddress) {
        if (companyAddress.hasOwnProperty(key) && address.hasOwnProperty(key)) {
          address[key] = companyAddress[key]
        }
      }

    } else {
      for (const key in address) {
        if (address.hasOwnProperty(key)) {
          address[key] = {
            value: "",
            message: "",
            isValid: false
          }
        }
      }
    }
    this.setState({ address })
  }

  render() {
    const { companyAddress, address, isLoading, companyNumber } = this.state;
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeVStyle}>
          <KeyboardAwareScrollView>
            <View style={styles.informationDetails}>
              <TextField
                placeholder="Company Number"
                LabelTitle="Company Number"
                onChangeText={this.onCompanyNumberChange}
                value={companyNumber.value}
                autoFocus={true}
                returnKeyType={"next"}
              // onSubmitEditing={() => this.lastNameInput.refs.lastNameRef.focus()}
              >
                {companyNumber.message !== '' && (
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
                      {companyNumber.message}
                    </Label>
                  </View>
                )}
              </TextField>


              <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>
                Company Address
                </Label>
              <View style={styles.borderLine} />
              <View style={{ bottom: 20, top: 2, width: Globals.isIpad ? 400 : '100%' }}>
                <TextField
                  placeholder="Address line 1"
                  LabelTitle="Address line 1"
                  onChangeText={(text) => this.handleUserInput('companyAddress', 'addressLine1', text)}
                  value={companyAddress.addressLine1.value}
                  returnKeyType={"next"}
                  onSubmitEditing={() => this.lastNameInput.refs.lastNameRef.focus()}>
                  {companyAddress.addressLine1.message !== '' && (
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
                        {companyAddress.addressLine1.message}
                      </Label>
                    </View>
                  )}
                </TextField>
                <View style={{ zIndex: -1 }}>
                  <TextField
                    placeholder="Address line 2"
                    LabelTitle="Address line 2"
                    onChangeText={(text) => this.handleUserInput('companyAddress', 'addressLine2', text)}
                    value={companyAddress.addressLine2.value}
                    ref={ref => this.lastNameInput = ref}
                    reference='lastNameRef'
                    returnKeyType={"next"}
                  >
                    {companyAddress.addressLine2.message !== '' && (
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
                          {companyAddress.addressLine2.message}
                        </Label>
                      </View>
                    )}
                  </TextField>
                </View>
                <View style={{ zIndex: -11 }}>
                  <TextField
                    placeholder="Enter Town/City"
                    LabelTitle="Town/City"
                    onChangeText={(text) => this.handleUserInput('companyAddress', 'city', text)}
                    value={companyAddress.city.value}
                    returnKeyType={"next"}>
                    {companyAddress.city.message !== '' && (
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
                          {companyAddress.city.message}
                        </Label>
                      </View>
                    )}
                  </TextField>
                </View>

                <View style={{ zIndex: -111 }}>
                  <TextField
                    placeholder="Enter Region"
                    LabelTitle="Region"
                    onChangeText={(text) => this.handleUserInput('companyAddress', 'region', text)}
                    value={companyAddress.region.value}
                    returnKeyType={"next"}>
                    {companyAddress.region.message !== '' && (
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
                          {companyAddress.region.message}
                        </Label>
                      </View>
                    )}
                  </TextField>
                </View>
                <View style={{ zIndex: -1111 }}>
                  <TextField
                    placeholder="Enter Postal Code"
                    LabelTitle="Enter Postal Code"
                    onChangeText={(text) => this.handleUserInput('companyAddress', 'postalcode', text)}
                    value={companyAddress.postalcode.value}
                    returnKeyType={"done"}>
                    {companyAddress.postalcode.message !== '' && (
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
                          {companyAddress.postalcode.message}
                        </Label>
                      </View>
                    )}
                  </TextField>
                </View>
              </View>

              {/* PP-12 <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>
                Your Address
                </Label>
              <View style={styles.borderLine} />
              <View style={{ width: Globals.isIpad ? 400 : '100%' }}>
                <CheckBox
                  style={{ marginBottom: 25, }}
                  onClick={() => { this.setState({ sameAddress: !this.state.sameAddress }, this.setAddress) }}
                  checkedImage={<CustomIcon name={"check"} style={styles.checkedIcon} />}
                  unCheckedImage={<View style={styles.checkIcon}></View>}
                  isChecked={this.state.sameAddress}
                  rightText={"Same as company address"}
                  rightTextStyle={{ color: Color.DarkGrey, fontFamily: "Montserrat-Regular", fontSize: fontXSmall16, lineHeight: 24 }}
                />
                <TextField
                  placeholder="Address line 1"
                  LabelTitle="Address line 1"
                  onChangeText={(text) => this.handleUserInput('address', 'addressLine1', text)}
                  value={address.addressLine1.value}
                  returnKeyType={"next"}
                  onSubmitEditing={() => this.lastNameInput.refs.lastNameRef.focus()}>
                  {address.addressLine1.message !== '' && (
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
                        {address.addressLine1.message}
                      </Label>
                    </View>
                  )}
                </TextField>
                <View style={{ zIndex: -1 }}>
                  <TextField
                    placeholder="Address line 2"
                    LabelTitle="Address line 2"
                    onChangeText={(text) => this.handleUserInput('address', 'addressLine2', text)}
                    value={address.addressLine2.value}
                    ref={ref => this.lastNameInput = ref}
                    reference='lastNameRef'
                    returnKeyType={"next"}
                  >
                    {address.addressLine2.message !== '' && (
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
                          {address.addressLine2.message}
                        </Label>
                      </View>
                    )}
                  </TextField>
                </View>
                <View style={{ zIndex: -11 }}>
                  <TextField
                    placeholder="Enter Town/City"
                    LabelTitle="Town/City"
                    onChangeText={(text) => this.handleUserInput('address', 'city', text)}
                    value={address.city.value}
                    returnKeyType={"next"}>
                    {address.city.message !== '' && (
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
                          {address.city.message}
                        </Label>
                      </View>
                    )}
                  </TextField>
                </View>
                <View style={{ zIndex: -111 }}>
                  <TextField
                    placeholder="Enter region"
                    LabelTitle="region"
                    onChangeText={(text) => this.handleUserInput('address', 'region', text)}
                    value={address.region.value}
                    returnKeyType={"next"}>
                    {address.region.message !== '' && (
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
                          {address.region.message}
                        </Label>
                      </View>
                    )}
                  </TextField>
                </View>

                <View style={{ zIndex: -1111 }}>
                  <TextField
                    placeholder="Enter Postal Code"
                    LabelTitle="Enter Postal Code"
                    onChangeText={(text) => this.handleUserInput('address', 'postalcode', text)}
                    value={address.postalcode.value}
                    returnKeyType={"done"}>
                    {address.postalcode.message !== '' && (
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
                          {address.postalcode.message}
                        </Label>
                      </View>
                    )}
                  </TextField>
                </View>
              </View> */}

              <KMButton
                onPress={this.onNextClick}
                fontSize_16
                Montserrat_Medium
                color={Color.BLACK}
                title="NEXT"
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
              <TouchableOpacity onPress={() => {
                this.props.navigation.navigate(Routes.uboPersonDetails);
              }} style={{ marginTop: -20, marginBottom: 20 }}>
                <Label fontSize_16 color={Color.DarkBlue} Montserrat_Medium>SKIP</Label>
              </TouchableOpacity>
            </View>


          </KeyboardAwareScrollView>
          {/* <ToastMessage message={this.state.message} isVisible={this.state.isShowToast} /> */}
          {isLoading && <ProgressHud />}
        </SafeAreaView>
        <NavigationEvents onWillFocus={this.getUserData} />
        {/* {isShowSignView && this.openSignatureView()} */}
      </View>
    );
  }


  isSubmitDisable() {
    // return false
    // if (this.state.isSoleTrader) {#
    return (
      !this.state.companyNumber.isValid ||
      !this.state.companyAddress.addressLine1.isValid ||      
      !this.state.companyAddress.addressLine2.isValid ||   
      !this.state.companyAddress.city.isValid ||
      !this.state.companyAddress.region.isValid ||
      !this.state.companyAddress.postalcode.isValid

    );
    // } else {
    //   return (
    //     !this.state.companyNumber.isValid ||
    //     !this.state.companyName.isValid ||
    //     !this.state.email.isValid ||
    //     !this.state.phoneNumber.isValid ||
    //     !this.state.tradingName.isValid ||
    //     !this.state.country
    //   );
    // }
  }

  getAccountType = async () => {
    let userData = JSON.parse(await getStoredData(Globals.kUserData));
    if (Globals.isClient) {
      return Accounts.INDIVIUAL;
    } else {
      return this.state.isSoleTrader
        ? Accounts.SOLE_TRADER
        : Accounts.INCORPORATE_BUSINESS;
    }
  };

  onNextClick = async () => {
    let { companyAddress, companyNumber, address } = this.state;
    let userData = JSON.parse(await getStoredData(Globals.kUserData))
    let oLegalRepresentativeDetail = userData.oLegalRepresentativeDetail
    let oCompanyDetail = userData.oCompanyDetail

    try {
      this.setState({ isLoading: true });
      const { screenProps } = this.props;
      if (!screenProps.isConnected) {
        return
      }
      let legalDetails = {}

      let oCompanyAddress = {
        "AddressLine1": companyAddress.addressLine1.value,
        "AddressLine2": companyAddress.addressLine2.value,
        "City": companyAddress.city.value,
        "Region": companyAddress.region.value,
        "PostalCode": companyAddress.postalcode.value,
        "Country": userData.sCountryOfResidence
      }

      oLegalRepresentativeDetail['address'] = {
        "AddressLine1": address.addressLine1.value,
        "AddressLine2": address.addressLine2.value,
        "City": address.city.value,
        "Region": address.region.value,
        "PostalCode": address.postalcode.value,
        "Country": userData.sCountryOfResidence
      }

      oCompanyDetail['sCompanyNumber'] = companyNumber.value

      let request = new FormData();
      request.append('userId', Globals.userId);
      request.append('oLegalRepresentativeDetail', JSON.stringify(oLegalRepresentativeDetail));
      request.append('oCompanyAddress', JSON.stringify(oCompanyAddress));
      request.append('oCompanyDetail', JSON.stringify(oCompanyDetail));

      let response = await API.editProfileBusiness(request)
      console.log("response", response)
      this.setState({ isLoading: false });
      // 
      
      if (response.status) {
        if(userData.sAccountType === "Business"){
          this.props.navigation.navigate(userData.has75share ? Routes.Financial_Information : Routes.EditBusinessUBO1);
        }else{
          this.props.navigation.navigate(Routes.Financial_Information);
        }
      }else{
        this.props.navigation.navigate(Routes.Financial_Information);
      }

      await setStoredData(Globals.kUserData, JSON.stringify(response.data))
      Globals.userId = response.data._id
      Globals.countryCode = response.data.nCountryCode
      Globals.isBuilder = (response.data._UserRoleId == Users.BUILDER) ? true : false
      Globals.isClient = (response.data._UserRoleId == Users.CLIENT) ? true : false

      // this.props.navigation.navigate(
      //   Routes.LegalContactInformation, { "legalDetails": JSON.stringify(legalDetails) }
      // );

      

    } catch (error) {
      console.log('editProfile error', error.message);
      this.setState({ isLoading: false });
    }


  };
}
