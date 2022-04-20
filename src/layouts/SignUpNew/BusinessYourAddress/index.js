/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, Image } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Label from '../../../components/Label';
import Color from '../../../utils/color'
import styles from "./styles"
import Globals, { isValidValue, Users, getCountryFromIso } from "../../../utils/Globals";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, validatePhone, validatePostalcode } from '../../../utils/validation';
import { ErrorMessage } from '../../../utils/message';
import { fontXSmall16 } from '../../../utils/theme';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import HeaderTitle from '../../../components/Header/HeaderTitle';
import TextField from '../../../components/TextField';
import KMButton from '../../../components/KMButton';
import { Routes } from '../../../utils/Routes';
import { getStoredData, setStoredData } from '../../../utils/store';
import CustomIcon from "../../../components/CustomIcon";
import API from '../../../API';
import ToastMessage from '../../../components/toastmessage';
import ProgressHud from '../../../components/ProgressHud';
import GlobalStyles from '../../../utils/GlobalStyles';
import HeaderRight from '../../../components/Header/HeaderRight';
import CheckBox from 'react-native-check-box';
import AsyncStorage from '@react-native-community/async-storage';
import countryData from "../../../../countries.json";
import TextFieldInput from '../../../components/TextFieldInput';



const images = {
    logoImage: require('./../../../assets/Images/logo.png')
}

export default class BusinessYourAddress extends Component {


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
            companyAddress: this.props.navigation.state.params.companyAddress,
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

    setAddress = () => {
        let { companyAddress } = this.state

        if (this.state.sameAddress) {

            this.setState({
                addressName1: {
                    value: companyAddress.addressName1,
                    message: "",
                    isValid: true,
                },
                addressName2: {
                    value: companyAddress.addressName2,
                    message: "",
                    isValid: true,
                },
                towncity: {
                    value: companyAddress.towncity,
                    message: "",
                    isValid: true,
                },
                postalcode: {
                    value: companyAddress.postalcode,
                    message: "",
                    isValid: true,
                },
                region: {
                    value: companyAddress.region,
                    message: "",
                    isValid: true,
                }
            })

        } else {
            this.setState({
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
                region: {
                    value: "",
                    message: "",
                    isValid: false,
                }
            })

        }
    }


    addBusinessAddress = async () => {

        const { towncity, postalcode, addressName1, addressName2, region } = this.state;

        this.setState({
            showLoader: true
        })

        let userID = await AsyncStorage.getItem('UserKey');
        let userData = await AsyncStorage.getItem(Globals.kUserData);

        const nationalityCode = countryData.find((item) => {
            return item.nationality == JSON.parse(userData).sNationality
        })


        const params = {
            userId: userID,
            isLastStep: true,
            oLegalRepresentativeDetail: JSON.stringify(
                {
                    sFirstName: JSON.parse(userData).sFirstName,
                    sLastName: JSON.parse(userData).sLastName,
                    dDob: JSON.parse(userData).dDob,
                    sEmail: JSON.parse(userData).sEmail,
                    sNationality: nationalityCode.iso2.toUpperCase(),
                    address: {
                        AddressLine1: addressName1.value,
                        AddressLine2: addressName2.value,
                        City: towncity.value,
                        Region: region.value,
                        PostalCode: postalcode.value,
                        Country: "GB"

                    }
                })
        };


        try {
            let response = await API.editProfileBusiness(params);

            this.setState({
                showLoader: false
            })
            if (response.status) {
                await setStoredData(Globals.kUserData, JSON.stringify(response.data))
                this.props.navigation.navigate(Routes.BankDetailsScreen);
            }
            else {
                alert("Please Check the Information")
            }
        } catch (err) {
            this.setState({
                showLoader: false
            })
            console.log("===Error message", err.message);
        }

    }

    render() {
        const { showLoader, towncity, postalcode, addressName1, addressName2, region } = this.state;
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
                        <HeaderTitle title={'Business address'} />
                        <HeaderRight />
                    </View>
                    <KeyboardAwareScrollView>
                        <View style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
                            <Image source={images.logoImage} style={styles.logoStyle} />
                        </View>

                        <View style={styles.informationDetails}>
                            <View style={{ width: (Globals.isIpad ? 400 : "100%") }}>


                                <CheckBox
                                    style={{ marginBottom: 25, }}
                                    onClick={() => { this.setState({ sameAddress: !this.state.sameAddress }, this.setAddress) }}
                                    checkedImage={<CustomIcon name={"check"} style={styles.checkedIcon} />}
                                    unCheckedImage={<View style={styles.checkIcon}></View>}
                                    isChecked={this.state.sameAddress}
                                    rightText={"Same as company address"}
                                    rightTextStyle={{ color: Color.DarkGrey, fontFamily: "Montserrat-Regular", fontSize: fontXSmall16, lineHeight: 24 }}
                                />

                                <View>
                                    <TextFieldInput
                                        placeholder='Address Line 1'
                                        LabelTitle='Address Line 1'
                                        onChangeText={this.onaddress1Change}
                                        customStyle={GlobalStyles.textFieldStyle}
                                        value={addressName1.value}
                                        returnKeyType={"next"}
                                    />
                                    {addressName1.message !== "" &&
                                        <View style={styles.errorMessageStyle}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{addressName1.message}</Label>
                                        </View>
                                    }
                                </View>
                                <View style={{ zIndex: -1 }}>

                                    <TextFieldInput
                                        placeholder='Address Line 2'
                                        LabelTitle='Address Line 2'
                                        onChangeText={this.onaddress2Change}
                                        customStyle={GlobalStyles.textFieldStyle}
                                        value={addressName2.value}
                                        returnKeyType={"next"}
                                    />
                                    {addressName2.message !== "" &&
                                        <View style={styles.errorMessageStyle}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{addressName2.message}</Label>
                                        </View>
                                    }
                                </View>
                                <View style={{ zIndex: -11 }}>
                                    <TextFieldInput
                                        placeholder='Enter Town/City'
                                        LabelTitle='Town/City'
                                        onChangeText={this.onTownCityChange}
                                        customStyle={GlobalStyles.textFieldStyle}
                                        value={towncity.value}
                                        returnKeyType={"next"}
                                    />
                                    {towncity.message !== "" &&
                                        <View style={styles.errorMessageStyle}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{towncity.message}</Label>
                                        </View>
                                    }
                                </View>

                                <View style={{ zIndex: -111 }}>
                                    <TextFieldInput
                                        placeholder='Region'
                                        LabelTitle='Region'
                                        onChangeText={this.onregionChange}
                                        customStyle={GlobalStyles.textFieldStyle}
                                        value={region.value}
                                    />
                                    {region.message !== "" &&
                                        <View style={styles.errorMessageStyle}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{region.message}</Label>
                                        </View>
                                    }
                                </View>
                                <View style={{ zIndex: -11111 }}>
                                    <TextFieldInput
                                        placeholder='Enter Postal Code'
                                        LabelTitle='Postal Code'
                                        onChangeText={this.onPostalCodeChange}
                                        customStyle={GlobalStyles.textFieldStyle}
                                        value={postalcode.value}
                                        returnKeyType={"done"}
                                    />

                                    {postalcode.message !== "" &&
                                        <View style={styles.errorMessageStyle}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{postalcode.message}</Label>
                                        </View>
                                    }
                                </View>
                            </View>

                            <KMButton
                                onPress={this.addBusinessAddress}
                                fontSize_16 Montserrat_Medium
                                color={Color.BLACK}
                                title="NEXT"
                                textStyle={{ padding: 0 }}
                                style={{ backgroundColor: this.isSubmitDisable() ? Color.GreyLightColor : Color.Yellow, marginTop: 20, marginBottom: 20, width: (Globals.isIpad ? 400 : "100%"), alignItems: "center", justifyContent: "center", height: 48, zIndex: -11111 }}
                                disabled={this.isSubmitDisable()}
                            />

                        </View>
                    </KeyboardAwareScrollView>
                    <ToastMessage message={this.state.message} isVisible={this.state.isShowToast} />
                    {showLoader && <ProgressHud />}
                </SafeAreaView>
                {/* <NavigationEvents onWillFocus={this.getUserData} /> */}
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

    onaddress1Change = (text) => {
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
    onaddress2Change = (text) => {
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
        return !this.state.addressName1.isValid || !this.state.addressName2.isValid || !this.state.region.isValid || !this.state.towncity.isValid || !this.state.postalcode.isValid
    }

}

