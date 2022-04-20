/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, Image, TouchableOpacity } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Label from '../../../components/Label';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import HeaderTitle from '../../../components/Header/HeaderTitle';
import HeaderRight from '../../../components/Header/HeaderRight';
import ProgressHud from '../../../components/ProgressHud';
import Mangopay from '../../../utils/mangopay';
import { fontXSmall16 } from '../../../utils/theme';
import CustomIcon from "../../../components/CustomIcon";

import styles from './styles';
import Globals, { isValidValue, isValidIntValue, getCountryFromIso, Accounts, getAddress, } from '../../../utils/Globals';
import Color from '../../../utils/color';
import { Routes } from '../../../utils/Routes';
import LocalImages from '../../../utils/LocalImages';
import { getStoredData, setStoredData } from '../../../utils/store';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import API from '../../../API';
import { getKycStatus } from '../../../utils/GetUserStatus';
import Share from 'react-native-share';

const images = {
  logoImage: require('../../../assets/Images/share.png')
}

export default class MyProfile extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderLeft
          iconName="burger_menu"
          onPress={() => {
            navigation.toggleDrawer();
          }}
        />
      ),
      headerTitle: () => <HeaderTitle title={'My Profile'} />,
      headerRight: (
        <HeaderRight
          buttonTitle="Edit"
          onPress={navigation.getParam("onEdit")}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isSoleTrader: true,
      userPhoto: LocalImages.Client_User,
      userSignature: LocalImages.Signature,

      fullName: '',
      companyName: '',
      dateofBirth: '',
      phoneNumber: '',
      email: '',
      bankAccNo: '',
      sortCode: '',
      address: '',

      lFullName: '',
      lDateOfBirth: '',
      lEmail: '',
      lPhone: '',
      lAddress: '',

      lNationality: '',

      companyNumber: '',
      companyAddress: '',
      companyName: '',
      taxCountry: '',
      tradingName: '',
      tradingAddress: '',
      registeredAddress: '',
      primaryFullName: '',
      primaryDob: '',
      primaryAddress: '',
      secondaryFullName: '',
      secondaryDob: '',
      secondaryAddress: '',
      hasPrimaryMember: false,
      lDob: "",
      hasSecondaryMember: false,
      isBusiness: false,
      recipient: 'hhhh'
    };
  }

  onEditClick = () => {
    // this.props.screenProps && this.props.screenProps.onRefreshUser(true)
    this.props.navigation.navigate(Routes.Personal_Information, { fromProfilePage: true });
  }

  //  share function
  onShare() {
    options = {
      title: 'copy code',
      // recipient,
      message: '',
    };


    Share.open(options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });

  };
  //  share function

  componentDidMount = async () => {
    this.props.navigation.setParams({
      onEdit: this.onEditClick
    });

    let response = await Mangopay.getBankAccountOfUser()
    let bankDetails = response.bankAccounts.filter((b) => b.Active == true)

    if (bankDetails.length > 0) {
      let { bankAccNo, sortCode } = this.state
      let isAccountNumber = bankDetails[0]?.AccountNumber
      bankAccNo = isAccountNumber ? bankDetails[0]?.AccountNumber : bankDetails[0].IBAN
      sortCode = isAccountNumber ? bankDetails[0]?.SortCode : bankDetails[0].BIC
      this.setState({ bankAccNo, sortCode })
    }
    this.getUserProfile();
  }

  getUserProfile = async () => {
    this.setState({ isLoading: true })
    // this.props.screenProps && this.props.screenProps.onRefreshUser()

    try {
      let response = await API.getUserProfile();
      this.setState({ isLoading: false });
      console.log('get user profile response', response);
      if (response.status) {
        await setStoredData(Globals.kUserData, JSON.stringify(response.data));
        this.setUserData(response.data);
        // this.setState({ user: response.data, isSoleTrader: isSoleTrader, profileComplete: response.data.hasOwnProperty('account_id') }, () => this.setFormValues(response.data))
      }
    } catch (error) {
      console.log('get user profile error', error.message);
      this.setState({ isLoading: false });
    }
  };

  setUserData = result => {
    let {
      companyNumber,
      companyName,
      companyAddress,
      taxCountry,
      tradingName,
      lDob,
      dDateofBirth,
      tradingAddress,
      registeredAddress,
      primaryFullName,
      primaryDob,
      primaryAddress,
      secondaryFullName,
      secondaryDob,
      secondaryAddress,
      hasPrimaryMember,
      hasSecondaryMember,
      lFullName,
      lDateOfBirth,
      lEmail, address,
      lNationality,
      lNation,
      lAddress,
      companyEmail,
      isBusiness,
      idProof, articalOfAssociation, regProof
    } = this.state;

    const companyDetails = result.oCompanyDetail
    if (companyDetails) {
      companyName = isValidValue(companyDetails.sCompanyName) ? companyDetails.sCompanyName : ''
      console.log("Company Name", result)
      companyEmail = isValidValue(companyDetails.sCompanyEmail) ? companyDetails.sCompanyEmail : ''
      companyNumber = isValidValue(companyDetails.sCompanyNumber) ? companyDetails.sCompanyNumber : ''

      isBusiness = result.sAccountType?.toLowerCase() == 'business' ? true : false

      const companyAddressDetails = result.oCompanyAddress
      if (companyAddressDetails) {
        companyAddress = getAddress(companyAddressDetails)
      }
    }

    const legalInfor = result.oLegalRepresentativeDetail
    if (legalInfor) {
      address = getAddress(legalInfor.address)
      lFullName = legalInfor.sFirstName + ' ' + legalInfor.sLastName;

      lDob = isValidValue(legalInfor.dDob)
        ? moment(legalInfor.dDob, 'DD-MM-YYYY', true).isValid()
          ? moment(legalInfor.dDob, 'DD-MM-YYYY').format(
            Globals.kDatePickerFormat,
          )
          : moment(legalInfor.dDob).format(Globals.kDatePickerFormat)
        : '';
      lEmail = isValidValue(legalInfor.sEmail) ? legalInfor.sEmail : '';

      lNation = isValidValue(legalInfor.sNationality)
        ? getCountryFromIso(legalInfor.sNationality)
        : '';
    }

    if (legalInfor) {
      const legalInfoAddress = legalInfor.address
      if (legalInfoAddress) {
        lAddress = `${isValidValue(legalInfoAddress.AddressLine1) ? legalInfoAddress.AddressLine1 + ',' : ''
          } ${isValidValue(legalInfoAddress.AddressLine2) ? legalInfoAddress.AddressLine2 + ',' : ''} ${isValidValue(legalInfoAddress.City) ? legalInfoAddress.City + ',' : ''
          } ${isValidValue(legalInfoAddress.Region)
            ? legalInfoAddress.Region + ','
            : ''
          } ${isValidValue(legalInfoAddress.Country)
            ? getCountryFromIso(legalInfoAddress.Country) + ','
            : ''
          } ${isValidValue(legalInfoAddress.PostalCode) ? legalInfoAddress.PostalCode : ''}`;

      }
    }
    const userPhoto = isValidValue(result.sProfilePic)
      ? { uri: result.sProfilePic }
      : LocalImages.Profile;
    const userSignature = isValidValue(result.signature)
      ? { uri: result.signature }
      : LocalImages.Signature;

    const fullName = result.sFirstName + ' ' + result.sLastName;
    console.log('my profile dDateofBirth', result.dDateofBirth);
    const dateofBirth = isValidValue(result.dDateofBirth)
      ? moment(result.dDateofBirth, 'DD-MM-YYYY', true).isValid()
        ? moment(result.dDateofBirth, 'DD-MM-YYYY').format(
          Globals.kDatePickerFormat,
        )
        : moment(result.dDateofBirth).format(Globals.kDatePickerFormat)
      : '';

    const phoneNumber = isValidValue(result.nPhoneNumber)
      ? result.nPhoneNumber
      : '';
    const email = isValidValue(result.sEmail) ? result.sEmail : '';


    // const bankAccNo = isValidIntValue(result.nBankAccNo)
    //   ? result.nBankAccNo
    //   : '';
    // const sortCode = isValidIntValue(result.sSortCode) ? result.sSortCode : '';

    const isSoleTrader = isValidValue(result.sAccountType)
      ? result.sAccountType === Accounts.SOLE_TRADER ||
      result.sAccountType === Accounts.INDIVIUAL
      : false;

    if (isValidValue(result.kyc_status)) {
      idProof = isValidValue(result.kyc_status.identity_proof) ? getKycStatus(result.kyc_status.identity_proof) : undefined
      articalOfAssociation = isValidValue(result.kyc_status.articals_of_association) ? getKycStatus(result.kyc_status.articals_of_association) : undefined
      regProof = isValidValue(result.kyc_status.registration_proof) ? getKycStatus(result.kyc_status.registration_proof) : undefined
    }

    this.setState({
      kyc: isValidValue(result.kyc_status),
      idProof,
      articalOfAssociation,
      regProof,

      userPhoto,
      userSignature,
      isBusiness,

      fullName,
      dateofBirth,

      phoneNumber,
      email,
      address,
      companyNumber,
      companyName,
      companyEmail,
      companyAddress,
      lFullName,
      lDob,
      lEmail,
      lNation,
      lAddress,

      // bankAccNo,
      // sortCode,
      isSoleTrader,
      taxCountry,
      tradingName,

      tradingAddress,
      registeredAddress,
      primaryFullName,

      primaryDob,
      primaryAddress,
      secondaryFullName,
      secondaryDob,
      secondaryAddress,
      hasPrimaryMember,
      hasSecondaryMember,
      isLoading: false,
      isBusiness

    });
  };

  render() {
    const {
      companyNumber,
      idProof,
      articalOfAssociation,
      regProof,
      userPhoto,

      fullName,
      companyName,
      companyEmail,
      address,
      dateofBirth,
      phoneNumber,
      email,
      lFullName,
      lDob,
      lEmail,
      lAddress,
      companyAddress,
      sortCode,
      bankAccNo,
      lNation, isLoading, isBusiness
    } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeVStyle}>
          <KeyboardAwareScrollView>
            <View style={styles.profileSignature}>
              {/* <Image style={{ width: (Globals.isIpad ? 160 : "30%"), aspectRatio: 1, marginRight: (Globals.isIpad ? 60 : 0), }} source={LocalImages.Profile} /> */}
              <Image style={styles.userPhotoStyle} source={userPhoto} />
            </View>

            <View>
              <View style={styles.informationDetails}>
                <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>
                  Personal Information
                  </Label>
                <View style={styles.borderLine} />

                <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.BLACK}
                    mr={5}>
                    Full Name:
                    </Label>
                  {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>John Doe</Label> */}
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.GreenGrey}>
                    {fullName}
                  </Label>
                </View>
                {/* <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Company Name:</Label> */}
                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>Revamp Consultancy LLC</Label> */}
                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{companyName}</Label>
                            </View> */}
                {dateofBirth ?
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 6,
                      marginBottom: 6,
                    }}>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.BLACK}
                      mr={5}>
                      DOB:
                    </Label>
                    {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>12/17/1991</Label> */}
                    <Label fontSize_14
                      Montserrat_Medium
                      color={Color.GreenGrey}>
                      {dateofBirth}
                    </Label>
                  </View>
                  : null}
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 6,
                    marginBottom: 6,
                  }}>
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.BLACK}
                    mr={5}>
                    Email:
                    </Label>
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.GreenGrey}>
                    {email}
                  </Label>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 6,
                    marginBottom: 6,
                  }}>
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.BLACK}
                    mr={5}>
                    Phone:
                    </Label>
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.GreenGrey}>
                    {phoneNumber}
                  </Label>
                </View>
              </View>
              {/* <View style={styles.codeDetails}>
                <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>
                  Referral code
                  </Label>
                <View style={styles.borderLine} />
                <View style={styles.copyCode}>
                   <View style={styles.dashedBorder}>
                  <Label style={styles.codeLabel}>
                    AZGH4518
                  </Label>
                </View>
                  <TouchableOpacity  onPress={() => {this.onShare() }}>
                    <Image source={images.logoImage} style={{width:15, height:15}}/>
                  </TouchableOpacity>
                </View>
                
              </View>
             */}
              {isBusiness &&
                <View
                  style={[
                    styles.informationDetails,
                    { marginTop: 32, marginBottom: 20 },
                  ]}>
                  <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>
                    Company Information
                  </Label>
                  <View style={styles.borderLine} />
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 6,
                      marginBottom: 6,
                    }}>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.BLACK}
                      mr={5}>
                      Company Name:
                    </Label>
                    {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>1000356786667</Label> */}
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.GreenGrey}>
                      {companyName}
                    </Label>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 6,
                      marginBottom: 6,
                    }}>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.BLACK}
                      mr={5}>
                      Company Number:
                    </Label>
                    {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>1000356786667</Label> */}
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.GreenGrey}>
                      {companyNumber}
                    </Label>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 6,
                      marginBottom: 6,
                    }}>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.BLACK}
                      mr={5}>
                      Company Email:
                    </Label>
                    {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>1000356786667</Label> */}
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.GreenGrey}>
                      {companyEmail}
                    </Label>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 6,
                      marginBottom: 6,
                    }}>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.BLACK}
                      mr={5}>
                      Address:
                    </Label>
                    {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>1000356786667</Label> */}
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.GreenGrey}>
                      {companyAddress || '--'}
                    </Label>
                  </View>
                  {/* {!Globals.isBuilder && <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Commission:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>20%</Label>
                            </View>} */}
                </View>
              }
              {isBusiness &&
                <View
                  style={[
                    styles.informationDetails,
                    { marginTop: 32, marginBottom: 20 },
                  ]}>
                  <Label style={{ textAlign: 'center' }} fontSize_16 Montserrat_Medium color={Color.BLACK}>
                    Legal Representative Information
                  </Label>
                  <View style={styles.borderLine} />
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 6,
                      marginBottom: 6,
                    }}>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.BLACK}
                      mr={5}>
                      Full Name:
                    </Label>
                    {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>John Doe</Label> */}
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.GreenGrey}>
                      {lFullName}
                    </Label>
                  </View>
                  {/* <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Company Name:</Label> */}
                  {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>Revamp Consultancy LLC</Label> */}
                  {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{companyName}</Label>
                            </View> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 6,
                      marginBottom: 6,
                    }}>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.BLACK}
                      mr={5}>
                      DOB:
                    </Label>
                    {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>12/17/1991</Label> */}
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.GreenGrey}>
                      {lDob}
                    </Label>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 6,
                      marginBottom: 6,
                    }}>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.BLACK}
                      mr={5}>
                      Email:
                    </Label>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.GreenGrey}>
                      {lEmail}
                    </Label>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 6,
                      marginBottom: 6,
                    }}>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.BLACK}
                      mr={5}>
                      Nationality:
                    </Label>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.GreenGrey}>
                      {lNation}
                    </Label>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 6,
                      marginBottom: 6,
                    }}>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.BLACK}
                      mr={5}>
                      Address:
                    </Label>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.GreenGrey}>
                      {lAddress || '--'}
                    </Label>
                  </View>

                </View>
              }
              {this.state.kyc && <View
                style={[
                  styles.informationDetails,
                  { marginTop: 32, marginBottom: 20 },
                ]}>
                <Label style={{ textAlign: 'center' }} fontSize_16 Montserrat_Medium color={Color.BLACK}>
                  KYC Information
                  </Label>
                <View style={styles.borderLine} />
                {idProof && <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 6,
                    marginBottom: 6,
                  }}>
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.BLACK}
                    mr={5}>
                    Identity Proof:
                    </Label>
                  {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>John Doe</Label> */}
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.GreenGrey}>
                    {idProof}
                  </Label>
                </View>
                }
                {/* {articalOfAssociation && <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 6,
                    marginBottom: 6,
                  }}>
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.BLACK}
                    mr={5}>
                    Articles of Assocation:
                    </Label>
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.GreenGrey}>
                    {articalOfAssociation}
                  </Label>
                </View>
                } */}
                {/* {regProof && <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 6,
                    marginBottom: 6,
                  }}>
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.BLACK}
                    mr={5}>
                    Registration Proof:
                    </Label>
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.GreenGrey}>
                    {regProof}
                  </Label>
                </View>
                } */}
              </View>

              }
              {/* {Globals.isClient &&
                <View style={[styles.informationDetails, { marginTop: 32 }]}>
                  <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>
                    Contact Information
                  </Label>
                  <View style={styles.borderLine} />
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 6,
                      marginBottom: 6,
                    }}>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.BLACK}
                      mr={5}>
                      Address:
                    </Label>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.GreenGrey}>
                      {address}
                    </Label>
                  </View>
                </View>
              } */}
              {/* {bankAccNo != '' && sortCode != '' &&
                <View
                  style={[
                    styles.informationDetails,
                    { marginTop: 32, marginBottom: 20 },
                  ]}>
                  <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>
                    Financial Information
                  </Label>
                  <View style={styles.borderLine} />
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 6,
                      marginBottom: 6,
                    }}>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.BLACK}
                      mr={5}>
                      Bank Acc:
                    </Label>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.GreenGrey}>
                      {bankAccNo}
                    </Label>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 6,
                      marginBottom: 6,
                    }}>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.BLACK}
                      mr={5}>
                      Sort Code:
                    </Label>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.GreenGrey}>
                      {sortCode}
                    </Label>
                  </View>
                </View>
              } */}

            </View>

          </KeyboardAwareScrollView>
        </SafeAreaView>
        <NavigationEvents onDidFocus={this.getUserProfile} />
        {isLoading && <ProgressHud />}
      </View>
    );
  }
}
