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
import Globals, { isValidValue, isValidIntValue, Users, getCountryFromIso, Accounts } from "../../../utils/Globals";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, validatePhone, validatePostalcode } from '../../../utils/validation';
import { ErrorMessage } from '../../../utils/message';
import { fontXSmall16 } from '../../../utils/theme';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import HeaderTitle from '../../../components/Header/HeaderTitle';
import HeaderRight from '../../../components/Header/HeaderRight';
import TextField from '../../../components/TextField';
import KMButton from '../../../components/KMButton';
import InputMask from '../../../components/InputMask';
import GlobalStyles from '../../../utils/GlobalStyles';
import { Routes } from '../../../utils/Routes';
import { getStoredData, setStoredData } from '../../../utils/store';
import CustomIcon from "../../../components/CustomIcon";
import DropDownCustom from "../../../components/DropDown";
import API from '../../../API';
import ToastMessage from '../../../components/toastmessage';
import ProgressHud from '../../../components/ProgressHud';
import ToolTip from '../../../components/Tooltip';

export default class ContactInformation extends Component {

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
                null
            ),
        };
    };

    constructor(props) {
        super(props)
        this.state = {
            phoneNumber: {
                value: "",
                message: "",
                isValid: false,
            },
            email: {
                value: "",
                message: "",
                isValid: false,
            },
            houseNumber: {
                value: "",
                message: "",
                isValid: false,
            },
            street: {
                value: "",
                message: "",
                isValid: false,
            },
            towncity: {
                value: "",
                message: "",
                isValid: false,
            },
            postalcode: {
                value: "",
                message: "",
                isValid: false,
            },
            addressName1: {
                value: "",
                message: "",
                isValid: false,
            },
            addressName2: {
                value: "",
                message: "",
                isValid: false,
            },
            region: {
                value: "",
                message: "",
                isValid: false,
            },
            // street: "",
            countryCode: Globals.countryCode,
            country: Globals.countryIso,
            countryName: Globals.countryName
        }
    }

    componentDidMount() {
        this.getUserData()
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

    getUserData = () => {
        getStoredData(Globals.kUserData).then(value => {
            let result = JSON.parse(value)
            console.log("oAddress", result.oAddress)
            let address = result.oAddress
            if (address) {
                const { countryCode, country, countryName, houseNumber, street, towncity, postalcode, addressName1, addressName2, region } = this.state;

                addressName1.value = isValidValue(address.AddressLine1) ? address.AddressLine1 : ""
                addressName1.isValid = isValidValue(address.AddressLine1)

                addressName2.value = isValidValue(address.AddressLine2) ? address.AddressLine2 : ""
                addressName2.isValid = isValidValue(address.AddressLine2)

                region.value = isValidValue(address.Region) ? address.Region : ""
                region.isValid = isValidValue(address.Region)

                // street.value = isValidValue(result.sStreet) ? result.sStreet : ""
                // street.isValid = isValidValue(result.sStreet)

                towncity.value = isValidValue(address.City) ? address.City : ""
                towncity.isValid = isValidValue(address.City)

                postalcode.value = isValidValue(address.PostalCode) ? address.PostalCode : ""
                postalcode.isValid = isValidValue(address.PostalCode)
                // country = isValidValue(result.sCountry) ? result.sCountry : ""
                // countryName = isValidValue(result.sCountry) ? getCountryFromIso(result.sCountry) : ""

                // const street = isValidValue(result.sAddressLine2) ? result.sAddressLine2 : ""
                this.setState({
                    houseNumber,
                    street,
                    towncity,
                    postalcode,
                    addressName1,
                    addressName2,
                    region,
                    country: isValidValue(address.Country) ? address.Country : Globals.countryIso,
                    countryName: isValidValue(address.Country) ? getCountryFromIso(address.Country) : Globals.countryName
                }, () => {
                    console.log("Region", this.state.region)
                })
            }
        })
    }

    render() {
        const { countryCode, phoneNumber, email, isLoading, countryName, houseNumber, street, towncity, postalcode, addressName1, addressName2, region } = this.state;
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={styles.informationDetails}>
                            <View style={{ flexDirection: 'row' }}>
                                <Label fontSize_16 Montserrat_Medium color={Color.BLACK} style={{ paddingRight: 10 }}>Your Address</Label>
                                <ToolTip
                                    toolTip={this.state.toolTip}
                                    onClickPress={() => this.setState({ toolTip: !this.state.toolTip })}
                                    placement={'bottom'}
                                    title="Your address should match the Photo ID you provide in the next step."
                                />
                            </View>
                            <View style={styles.borderLine}></View>
                            <View style={{ width: (Globals.isIpad ? 400 : "100%") }}>
                                {/* <InputMask
                                    type={'custom'}
                                    options={{ mask: '9999999999999' }}
                                    placeholder='Enter Phone Number'
                                    LabelTitle='Phone Number'
                                    onChangeText={this.onPhoneNumberChange}
                                    value={phoneNumber.value}
                                    keyboardType={"phone-pad"}
                                    customStyle={{ width: "77%", height: 48 }}
                                    isCountryCode={true}
                                    reference={ref => this.phone = ref}
                                    countryCode={countryCode}
                                    autoFocus={true}
                                    onSelectCountry={() => this.setState({ countryCode: this.phone.getValue() })}
                                >
                                    {phoneNumber.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{phoneNumber.message}</Label>
                                        </View>
                                    }
                                </InputMask> */}
                                {/* <View style={{ zIndex: -1 }}>
                                    <TextField
                                        placeholder='Email'
                                        LabelTitle='Enter Email'
                                        autoCapitalize={"none"}
                                        onChangeText={this.onEmailChange}
                                        value={email.value}
                                        keyboardType={"email-address"}>
                                        {email.message !== "" &&
                                            <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                                <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                                <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{email.message}</Label>
                                            </View>
                                        }
                                    </TextField>
                                </View> */}
                                {/* <TextField
                                    placeholder='Enter House Name/Number'
                                    LabelTitle='House Name/Number'
                                    onChangeText={this.onhouseNumberChange}
                                    value={houseNumber.value}
                                >
                                    {houseNumber.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{houseNumber.message}</Label>
                                        </View>
                                    }
                                </TextField> */}
                                {/* <View style={{ zIndex: -1 }}>
                                    <TextField
                                        placeholder='Enter Street'
                                        LabelTitle='Street'
                                        onChangeText={this.onstreetChange}
                                        value={street.value}
                                    />
                                    {street.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{street.message}</Label>
                                        </View>
                                    }
                                </View> */}
                                <View>
                                    <TextField
                                        placeholder='Address Line 1'
                                        LabelTitle='Address Line 1'
                                        onChangeText={this.onaddressChange}
                                        value={addressName1.value}
                                        returnKeyType={"next"}
                                    />
                                    {addressName1.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{addressName1.message}</Label>
                                        </View>
                                    }
                                </View>
                                <View style={{ zIndex: -1 }}>
                                    <TextField
                                        placeholder='Address Line 2'
                                        LabelTitle='Address Line 2'
                                        onChangeText={this.onaddress1Change}
                                        value={addressName2.value}
                                        returnKeyType={"next"}
                                    />
                                    {addressName2.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{addressName2.message}</Label>
                                        </View>
                                    }
                                </View>
                                <View style={{ zIndex: -11 }}>
                                    <TextField
                                        placeholder='Enter Town/City'
                                        LabelTitle='Town/City'
                                        onChangeText={this.onTownCityChange}
                                        value={towncity.value}
                                        returnKeyType={"next"}
                                    />
                                    {towncity.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{towncity.message}</Label>
                                        </View>
                                    }
                                </View>

                                <View style={{ zIndex: -111 }}>
                                    <TextField
                                        placeholder='Region'
                                        LabelTitle='Region'
                                        onChangeText={this.onregionChange}
                                        value={region.value}
                                    />
                                    {region.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{region.message}</Label>
                                        </View>
                                    }
                                </View>
                                <View style={{ zIndex: -1111 }}>
                                    <DropDownCustom type='country' value={this.state.countryName} labelTitle='Country of Residence' Title='Select Country' options={[]}
                                        onOptionChange={(country) => {
                                            console.log("Country", country.iso2)
                                            this.setState({ country: country.iso2, countryName: country.name })
                                        }} >
                                    </DropDownCustom>
                                </View>
                                <View style={{ zIndex: -11111 }}>
                                    <TextField
                                        placeholder='Enter Postal Code'
                                        LabelTitle='Postal Code'
                                        onChangeText={this.onPostalCodeChange}
                                        value={postalcode.value}
                                        returnKeyType={"done"}
                                    />

                                    {postalcode.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{postalcode.message}</Label>
                                        </View>
                                    }
                                </View>
                            </View>

                            <KMButton onPress={this.onNextClick}
                                fontSize_16 Montserrat_Medium
                                color={Color.BLACK}
                                title="NEXT"
                                textStyle={{ padding: 0 }}
                                style={{ backgroundColor: this.isSubmitDisable() ? Color.GreyLightColor : Color.Yellow, marginTop: 20, marginBottom: 20, width: (Globals.isIpad ? 400 : "100%"), alignItems: "center", justifyContent: "center", height: 48, zIndex: -11111 }}
                                disabled={this.isSubmitDisable()}
                            />
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate(Routes.Financial_Information)
                            }} style={{ marginBottom: 20 }}>
                                <Label fontSize_16 color={Color.DarkBlue} Montserrat_Medium>SKIP</Label>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                    <ToastMessage message={this.state.message} isVisible={this.state.isShowToast} />
                    {isLoading && <ProgressHud />}
                </SafeAreaView>
                <NavigationEvents onWillFocus={this.getUserData} />
            </View >
        );
    }

    onEmailChange = (text) => {
        const email = this.state.email
        email.value = text.trim()

        if (email.value.length == 0 || email.value == "") {
            email.message = ErrorMessage.emailRequired
            email.isValid = false
        } else if (!validateEmail(email.value)) {
            email.message = ErrorMessage.emailInvalid
            email.isValid = false
        } else {
            email.message = ""
            email.isValid = true
        }
        console.log("email", email)
        this.setState({
            email
        })
        // Console.log("email",email)
    }

    onPhoneNumberChange = (text) => {
        const phoneNumber = this.state.phoneNumber
        phoneNumber.value = text.trim()

        if (phoneNumber.value.length == 0 || phoneNumber.value == "") {
            phoneNumber.message = ErrorMessage.phoneRequired
            phoneNumber.isValid = false
        } else if (!validatePhone(phoneNumber.value)) {
            phoneNumber.message = ErrorMessage.phoneInvalid
            phoneNumber.isValid = false
        } else {
            phoneNumber.message = ""
            phoneNumber.isValid = true
        }
        this.setState({
            phoneNumber
        })
    }

    onaddressChange = (text) => {
        const addressName1 = this.state.addressName1
        addressName1.value = text
        addressName1.isValid = true
        if (addressName1.value.length == 0 || addressName1.value == "") {
            addressName1.message = ErrorMessage.addressRequired
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
            addressName2.message = ErrorMessage.address2Required
            addressName2.isValid = false
        } else {
            addressName2.message = ""
            addressName2.isValid = true
        }
        this.setState({
            addressName2
        })
    }
    onregionChange = (text) => {
        const region = this.state.region
        region.value = text
        region.isValid = true
        if (region.value.length == 0 || region.value == "") {
            region.message = ErrorMessage.regionRequired
            region.isValid = false
        } else {
            region.message = ""
            region.isValid = true
        }
        this.setState({
            region
        })
    }
    onTownCityChange = (text) => {
        const towncity = this.state.towncity
        towncity.value = text
        towncity.isValid = true
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
    isSubmitDisable() {
        return !this.state.addressName1.isValid || !this.state.addressName1.isValid || !this.state.region.isValid || !this.state.towncity.isValid || !this.state.country || !this.state.postalcode.isValid
    }



    onNextClick = async () => {
        let { addressName1, addressName2, region, towncity, country, postalcode, } = this.state
        let userData = await getStoredData(Globals.kUserData)
        try {
            let request = new FormData();
            let obj = {}
            obj.AddressLine1 = addressName1.value
            obj.AddressLine2 = addressName2.value
            obj.City = towncity.value
            obj.Region = region.value
            obj.PostalCode = postalcode.value
            obj.Country = country


            request.append("userId", Globals.userId);
            request.append("oAddress", JSON.stringify(obj));

            // request.append("sHouseNo", houseNumber.value);
            // request.append("sStreet", street.value);
            // request.append("sCity", towncity.value);
            // request.append("sCountry", country.toUpperCase());
            // request.append("sPostalCode", postalcode.value);
            // request.append("sAccountType", Globals.accountType);

            console.log("update profile request====>", request)
            this.setState({ isLoading: true });

            let response = await API.editProfileIndividual(request)
            console.log("response", response)
            this.setState({ isLoading: false });
            if (response.status) {
                await setStoredData(Globals.kUserData, JSON.stringify(response.data))
                Globals.userId = response.data._id
                Globals.countryCode = response.data.nCountryCode
                Globals.isBuilder = (response.data._UserRoleId == Users.BUILDER) ? true : false
                Globals.isProfileCompleted = response.data.isProfileCompleted
                this.props.navigation.navigate(Routes.Financial_Information)
            } else {
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

            }
            // this.props.navigation.navigate(Routes.Financial_Information)
        } catch (error) {
            console.log("editProfile error", error.message);
            this.setState({ isLoading: false });
        }




    }
}

