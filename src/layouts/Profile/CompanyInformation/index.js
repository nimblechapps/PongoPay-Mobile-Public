/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Label from '../../../components/Label';
import Color from '../../../utils/color'
import styles from "./styles"
import { validateCharacter, validateName } from '../../../utils/validation';

import Globals, { isValidIntValue, Users, isValidValue, Accounts, afterSuccessLogin, getCountryFromIso, _calculateAge, getNationalityFromIso } from "../../../utils/Globals";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateAccountNumber, validatePhone, validateEmail, validatePostalcode } from '../../../utils/validation';
import { ErrorMessage } from '../../../utils/message';
import { fontXSmall16 } from '../../../utils/theme';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import HeaderTitle from '../../../components/Header/HeaderTitle';
import HeaderRight from '../../../components/Header/HeaderRight';
import TextField from '../../../components/TextField';
import KMButton from '../../../components/KMButton';
import ToastMessage from '../../../components/toastmessage';
import DropDownCustom from "../../../components/DropDown";
import GlobalStyles from '../../../utils/GlobalStyles';
import { getStoredData, setStoredData } from '../../../utils/store';
import ProgressHud from '../../../components/ProgressHud';
import API from '../../../API';
import { Routes } from '../../../utils/Routes';
import CustomIcon from "../../../components/CustomIcon";
import { screenWidth, } from '../../../utils/theme';
import {
    showDocumentPicker,
    showImagePickerView,
} from '../../../utils/DocumentPicker';

import DatePicker from 'react-native-datepicker';
import moment from 'moment';


export default class CompanyInformation extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: Globals.isProfileCompleted ? (
                <HeaderLeft
                    iconName="burger_menu"
                    onPress={() => {
                        navigation.toggleDrawer();
                    }}
                />
            ) : <HeaderLeft
                iconName="left-arrow"
                onPress={() => {
                    navigation.goBack();
                }}
            />,
            headerTitle: () => <HeaderTitle title={'Edit Profile'} />,
            headerRight: (
                <HeaderRight
                    buttonTitle={Globals.isProfileCompleted ? "Back" : 'Log out'}
                    onPress={() => {
                        Globals.isProfileCompleted ? navigation.goBack() : navigation.push(Routes.Login)
                    }}
                />
            ),
        };
    };

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isShowToast: false,
            isOpen: false,
            companyName: {
                value: "",
                message: "",
                isValid: false,
            },
            email: {
                value: "",
                message: "",
                isValid: false,
            },
            LRfirstName: {
                value: "",
                message: "",
                isValid: false,
            },
            LRlastName: {
                value: "",
                message: "",
                isValid: false,
            },
            LRdob: {
                value: "",
                message: "",
                isValid: false,
            },
            LRnationality: {
                value: Globals.countryIso,
                name: Globals.nationalityName,
                message: "",
                isValid: false,
            },
            LRcountry: {
                value: Globals.countryIso,
                name: Globals.countryName,
                isValid: false,
            },

            countryCode: Globals.countryCode,
            countryName: Globals.countryName,
            country: Globals.countryIso,
            isTermsAccepted: false,
        }
    }

    componentDidMount() {
        this.getUserData()
    }


    getUserData = () => {
        getStoredData(Globals.kUserData).then(value => {
            let result = JSON.parse(value)
            console.log("FinancialInformation UserData", value)
            let companyDetail = result.oCompanyDetail
            let oLegalRepresentativeDetail = result.oLegalRepresentativeDetail
            let { companyName, email } = this.state
            let { LRfirstName, LRlastName, LRdob, LRnationality, LRcountry } = this.state

            if (companyDetail) {
                companyName.value = companyDetail.sCompanyName ? companyDetail.sCompanyName : ""
                companyName.isValid = isValidValue(companyDetail.sCompanyName)
                // const countryCode = isValidValue(result.nCountryCode) ? result.nCountryCode : Globals.countryCode
                // companyNumber.value = companyDetail.sCompanyNumber ? companyDetail.sCompanyNumber : ""
                // companyNumber.isValid = isValidValue(companyDetail.sCompanyNumber)

                email.value = companyDetail.sCompanyEmail ? companyDetail.sCompanyEmail : ""
                email.isValid = isValidValue(companyDetail.sCompanyEmail)
            }

            if (oLegalRepresentativeDetail) {
                LRfirstName.value = oLegalRepresentativeDetail.sFirstName ? oLegalRepresentativeDetail.sFirstName : ""
                LRfirstName.isValid = isValidValue(oLegalRepresentativeDetail.sFirstName)


                LRlastName.value = oLegalRepresentativeDetail.sLastName ? oLegalRepresentativeDetail.sLastName : ""
                LRlastName.isValid = isValidValue(oLegalRepresentativeDetail.sLastName)

                LRdob.value = oLegalRepresentativeDetail.dDob ? new Date(oLegalRepresentativeDetail.dDob) : ""
                LRdob.isValid = isValidValue(oLegalRepresentativeDetail.dDob)

                LRnationality.value = oLegalRepresentativeDetail.sNationality ? oLegalRepresentativeDetail.sNationality : ""
                LRnationality.name = oLegalRepresentativeDetail.sNationality ? getNationalityFromIso(oLegalRepresentativeDetail.sNationality) : ""
                LRnationality.isValid = isValidValue(oLegalRepresentativeDetail.sNationality)

                LRcountry.value = oLegalRepresentativeDetail.sCountry ? oLegalRepresentativeDetail.sCountry : ""
                LRcountry.name = oLegalRepresentativeDetail.sCountry ? getCountryFromIso(oLegalRepresentativeDetail.sCountry) : ""
                LRcountry.isValid = isValidValue(oLegalRepresentativeDetail.sCountry)

                // const countryCode = isValidValue(companyAddress.Country) ? companyAddress.Country : Globals.countryCode


            } else {
                let { LRfirstName, LRlastName, LRdob, LRnationality, LRcountry } = this.state
                LRfirstName.value = result.sFirstName ? result.sFirstName : ""
                LRfirstName.isValid = isValidValue(result.sFirstName)


                LRlastName.value = result.sLastName ? result.sLastName : ""
                LRlastName.isValid = isValidValue(result.sLastName)

                LRdob.value = result.dDateofBirth ? new Date(result.dDateofBirth) : ""
                LRdob.isValid = isValidValue(result.dDateofBirth)

                LRnationality.value = result.sNationality ? result.sNationality : LRnationality.value
                LRnationality.name = result.sNationality ? getCountryFromIso(result.sNationality) : LRnationality.name
                LRnationality.isValid = isValidValue(result.sNationality)

                LRcountry.value = result.sCountryOfResidence ? result.sCountryOfResidence : LRcountry.value
                LRcountry.name = result.sCountryOfResidence ? getCountryFromIso(result.sCountryOfResidence) : LRcountry.name
                LRcountry.isValid = isValidValue(result.sCountryOfResidence)
            }

            this.setState({
                LRfirstName,
                LRlastName,
                LRdob,
                LRnationality,
                LRcountry,
                companyName,
                // companyNumber,
                email,
                profileComplete: result.hasOwnProperty('wallet_id'),
                sAccountType: result.sAccountType
            })
        })
    }

    onSelectImage = () => {
        showImagePickerView(options, response => {
            if (response.customButton == 'Choose from files') {
                showDocumentPicker(false, (error, response) => {
                    if (error) {
                        return;
                    }
                    this.handleChooseFile(response);
                });
            } else {
                if (!response.didCancel && !response.error && !response.customButton) {
                    this.handleChooseFile(response);
                }
            }
        });
    };

    handleUserInput(refs, text) {
        let state = {}
        let value = text
        let isValid = false
        let message = ''

        switch (refs) {
            case 'LRfirstName':
                isValid = text.length > 0 && validateName(text)
                message = !isValid ? (text.length <= 0 ? ErrorMessage.firstNameRequired : ErrorMessage.firstNameInvalid) : ''
                break;
            case 'LRlastName':
                isValid = text.length > 0 && validateName(text)
                message = !isValid ? (text.length <= 0 ? ErrorMessage.lastNameRequired : ErrorMessage.lastNameInvalid) : ''
                break;
            case 'LRdob':
                isValid = text && _calculateAge(new Date(text)) > 16
                message = !isValid ? (text == undefined ? ErrorMessage.dateOfBirthRequired : ErrorMessage.dateOfBirthInvalid) : ''
                break;
            default:
                break;
        }
        state[refs] = { value, isValid, message }
        this.setState(state)
    }

    render() {
        const { isLoading, bankAccNo, commission, companyNumber, isTermsAccepted, email, companyName, addressName1, addressName2, towncity, region, postalcode } = this.state;
        const { LRfirstName, LRlastName, LRdob, LRnationality, LRcountry } = this.state
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={styles.informationDetails}>
                            <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>Company Information</Label>
                            <View style={styles.borderLine}></View>
                            <View style={{ width: (Globals.isIpad ? 400 : "100%") }}>
                                <View style={{ zIndex: -1 }}>
                                    <TextField
                                        disabled={this.state.profileComplete}
                                        placeholder="Enter Registered Business Name"
                                        LabelTitle="Registered Business Name"
                                        onChangeText={this.onCompanyNameChange}
                                        value={companyName.value}
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => this.companyNumberInput.refs.companyNumberRef.focus()}
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
                                            placeholder="Enter Email"
                                            LabelTitle="Email"
                                            autoCapitalize={'none'}
                                            onChangeText={this.onEmailChange}
                                            value={email.value}
                                            ref={ref => this.companyEmailInput = ref}
                                            reference='companyEmailRef'
                                            returnKeyType={"next"}
                                            onSubmitEditing={() => this.address1Input.refs.address1Ref.focus()}

                                            keyboardType={'email-address'}>
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

                                </View>
                            </View>
                            <View style={styles.informationDetails}>
                                <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>Legal Representative Information</Label>
                                <View style={styles.borderLine} />
                                <View style={{ width: Globals.isIpad ? 400 : '100%' }}>
                                    <TextField
                                        placeholder="First Name"
                                        LabelTitle="First Name"
                                        onChangeText={(text) => this.handleUserInput('LRfirstName', text)}
                                        value={LRfirstName.value}
                                        autoFocus={true}
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => this.lastNameInput.refs.lastNameRef.focus()}>
                                        {LRfirstName.message !== '' && (
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
                                                    {LRfirstName.message}
                                                </Label>
                                            </View>
                                        )}
                                    </TextField>
                                    <View style={{ zIndex: -1 }}>
                                        <TextField
                                            placeholder="Last Name"
                                            LabelTitle="Last Name"
                                            onChangeText={(text) => this.handleUserInput('LRlastName', text)}
                                            value={LRlastName.value}
                                            ref={ref => this.lastNameInput = ref}
                                            reference='lastNameRef'
                                            returnKeyType={"next"}
                                        >
                                            {LRlastName.message !== '' && (
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
                                                        {LRlastName.message}
                                                    </Label>
                                                </View>
                                            )}
                                        </TextField>
                                    </View>
                                    <View style={{ zIndex: -11 }}>
                                        <Label fontSize_16 color={Color.DarkGrey} mb={10}>Birthday</Label>
                                        <DatePicker
                                            disabled={this.state.profileComplete}
                                            style={{
                                                width: Globals.isIpad ? 400 : screenWidth - 30,
                                                marginBottom: 20,
                                            }}
                                            date={LRdob.value}
                                            mode="date"
                                            placeholder="DD-MM-YYYY"
                                            format="DD-MM-YYYY"
                                            maxDate={new Date()}
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
                                                this.handleUserInput('LRdob', datObj)
                                                // this.emailInput.refs.emailRef.focus()
                                            }}
                                        />

                                        {LRdob.message != '' && (
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
                                                    {LRdob.message}
                                                </Label>
                                            </View>
                                        )}
                                    </View>

                                    <View style={{ zIndex: -1111, height: 90 }}>
                                        <DropDownCustom type='nationality' value={this.state.LRnationality.name} labelTitle='Nationality' Title='Select Nationality' options={[]}
                                            onOptionChange={(country) => {
                                                console.log("Country", country.iso2)
                                                this.setState({
                                                    LRnationality: {
                                                        value: country.iso2,
                                                        name: country.nationality,
                                                        message: "",
                                                        isValid: false,
                                                    },
                                                })
                                            }} >
                                        </DropDownCustom>
                                    </View>
                                    <View style={{ zIndex: 99, height: 90 }}>
                                        <DropDownCustom type='country' value={this.state.LRcountry.name} labelTitle='Country of Residence' Title='Select Country' options={[]}
                                            onOptionChange={(country) => {
                                                console.log("Country", country.iso2)
                                                this.setState({
                                                    LRcountry: {
                                                        value: country.iso2,
                                                        name: country.name,
                                                        message: "",
                                                        isValid: false,
                                                    },
                                                })
                                            }} >
                                        </DropDownCustom>
                                    </View>
                                </View>
                            </View>



                            <KMButton
                                fontSize_16 Montserrat_Medium
                                color={Color.BLACK}
                                title={this.state.isSoleTrader ? "UPDATE" : "Next"}
                                textStyle={{ padding: 0 }}
                                style={{ backgroundColor: this.isSubmitDisable() ? Color.GreyLightColor : Color.Yellow, marginTop: 20, marginBottom: 40, width: (Globals.isIpad ? 400 : "100%"), alignItems: 'center', justifyContent: 'center', height: 48, zIndex: -1 }}
                                disabled={this.isSubmitDisable()}
                                onPress={this.onUpdateClick}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                    <ToastMessage message={this.state.message} isVisible={this.state.isShowToast} />
                </SafeAreaView>
                {isLoading && <ProgressHud />}
                <NavigationEvents onWillFocus={this.getUserData} />
            </View>
        );
    }


    onCompanyNumberChange = (text) => {
        const companyNumber = this.state.companyNumber
        companyNumber.value = text

        if (companyNumber.value.length == 0 || companyNumber.value == "") {
            companyNumber.message = ErrorMessage.companyNumberRequired
            companyNumber.isValid = false
        } else if (!validateCharacter(companyNumber.value)) {
            companyNumber.message = ErrorMessage.firstNameInvalid;
            companyNumber.isValid = false;
        } else {
            companyNumber.message = ""
            companyNumber.isValid = true
        }
        this.setState({
            companyNumber
        })
    }

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
    onaddressChange = (text) => {
        const addressName1 = this.state.addressName1
        addressName1.value = text
        addressName1.isValid = true
        if (addressName1.value.length == 0 || addressName1.value == "") {
            addressName1.message = ErrorMessage.addressName1Required
            addressName1.isValid = false
        } else {
            addressName1.message = ""
            addressName1.isValid = true
        }
        this.setState({
            addressName1
        })
    }

    onaddress1Change = (text) => {
        const addressName2 = this.state.addressName2
        addressName2.value = text
        addressName2.isValid = true
        if (addressName2.value.length == 0 || addressName2.value == "") {
            addressName2.message = ErrorMessage.addressName2Required
            addressName2.isValid = false
        } else {
            addressName2.message = ""
            addressName2.isValid = true
        }
        this.setState({
            addressName2
        })
    }
    onTownCityChange = (text) => {
        const towncity = this.state.towncity
        towncity.value = text

        if (towncity.value.length == 0 || towncity.value == "") {
            towncity.message = ErrorMessage.towncityRequired
            towncity.isValid = false
        } else {
            towncity.message = ""
            towncity.isValid = true
        }
        this.setState({
            towncity
        })
    }
    onregionChange = (text) => {
        const region = this.state.region
        region.value = text
        region.isValid = true
        if (region.value.length == 0 || region.value == "") {
            region.message = ErrorMessage.streetRequired
            region.isValid = false
        } else {
            region.message = ""
            region.isValid = true
        }
        this.setState({
            region
        })
    }

    onPostalCodeChange = (text) => {
        const postalcode = this.state.postalcode
        postalcode.value = text

        if (postalcode.value.length == 0 || postalcode.value == "") {
            postalcode.message = ErrorMessage.postalcodeRequired
            postalcode.isValid = false
        } else if (!validatePostalcode(postalcode.value)) {
            postalcode.message = ErrorMessage.postalcodeInvalid
            postalcode.isValid = false
        } else {
            postalcode.message = ""
            postalcode.isValid = true
        }
        this.setState({
            postalcode
        })
    }
    isSubmitDisable() {
        // if (!Globals.isProfileCompleted) {
        return !this.state.companyName.isValid || !this.state.email.isValid
        // } else {
        //     return !this.state.companyName.isValid || !this.state.phoneNumber.isValid
        // }
    }


    // getAccountType = async () => {
    //     let userData = JSON.parse(await getStoredData(Globals.kUserData))
    //     if (Globals.isClient) {
    //         return Accounts.INDIVIUAL
    //     } else {
    //         return userData.sAccountType
    //     }
    // }

    onUpdateClick = async () => {
        console.log("OnUIpdate click")
        let userData = JSON.parse(await getStoredData(Globals.kUserData))
        let isSoleTrader = userData.sAccountType == Accounts.SOLE_TRADER

        if (!this.props.screenProps.isConnected) {
            return
        }

        this.setState({ isLoading: true });

        try {
            let { companyName, email, LRfirstName, LRlastName, LRdob, LRnationality, LRcountry } = this.state
            let request = new FormData();
            let legalDetails = userData.oLegalRepresentativeDetail || {}
            let companyObj = userData.oCompanyDetail || {}
            // companyObj['sCompanyNumber'] = companyNumber.value
            companyObj['sCompanyName'] = companyName.value
            companyObj['sCompanyEmail'] = email.value
            legalDetails['sFirstName'] = LRfirstName.value
            legalDetails['sLastName'] = LRlastName.value
            legalDetails['dDob'] = moment(LRdob.value).format("YYYY-MM-DD")
            legalDetails['sEmail'] = email.value
            legalDetails['sNationality'] = LRnationality.value
            legalDetails['sCountry'] = LRcountry.value

            request.append("userId", Globals.userId);
            request.append("oCompanyDetail", JSON.stringify(companyObj));
            request.append("oLegalRepresentativeDetail", JSON.stringify(legalDetails));

            // request.append("sAccountType", this.state.sAccountType);

            let response = await API.editProfileBusiness(request)
            console.log("response", response)
            this.setState({ isLoading: false });
            const { screenProps } = this.props;
            if (!screenProps.isConnected) {
                return
            }
            this.props.navigation.navigate(Routes.LegalInformation);
            // this.props.navigation.navigate(Routes.uboPersonDetails);

            if (response.status) {
                this.setState({
                    isShowToast: true,
                    message: response.msg
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            isShowToast: false
                        })
                    }, 5000)

                });
                await setStoredData(Globals.kUserData, JSON.stringify(response.data))
                Globals.userId = response.data._id
                Globals.countryCode = response.data.nCountryCode
                Globals.isBuilder = (response.data._UserRoleId == Users.BUILDER) ? true : false
                Globals.isClient = (response.data._UserRoleId == Users.CLIENT) ? true : false

            } else {
                // screenProps.callback(response)
            }

        } catch (error) {
            console.log("editProfile error", error.message);
            this.setState({ isLoading: false });
        }
    }

}

