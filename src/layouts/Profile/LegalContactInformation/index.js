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

export default class LegalContactInformation extends Component {

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
        const { params = {} } = props.navigation.state;
        console.log("==>", params.legalDetails)
        this.state = {
            legalDetails: params.legalDetails,
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
            console.log("Result", result.sAccountType)
            let legalDetails = (result.oLegalRepresentativeDetail)
            if (legalDetails) {
                let address = legalDetails.address


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
                        sAccountType: result.sAccountType,
                        country: isValidValue(address.Country) ? address.Country : Globals.countryIso,
                        countryName: isValidValue(address.Country) ? getCountryFromIso(address.Country) : getCountryFromIso(Globals.countryIso)
                    }, () => {
                        console.log("Region", this.state.region)
                    })
                }
            }
        })

    }

    render() {
        const { countryCode, phoneNumber, email, isLoading, countryName, houseNumber, street, towncity, postalcode, addressName1, addressName2, region } = this.state;

        console.log('countryName====>', countryName)
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={styles.informationDetails}>
                            <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>Address</Label>
                            <View style={styles.borderLine}></View>
                            <View style={{ width: (Globals.isIpad ? 400 : "100%") }}>
                                <View style={{ zIndex: -11 }}>
                                    <TextField
                                        placeholder='Address Line 1'
                                        LabelTitle='Address Line 1'
                                        onChangeText={this.onaddressChange}
                                        value={addressName1.value}
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => this.address2Input.refs.address2Ref.focus()}

                                    />
                                    {addressName1.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{addressName1.message}</Label>
                                        </View>
                                    }
                                </View>
                                <View style={{ zIndex: -111 }}>
                                    <TextField
                                        placeholder='Address Line 2'
                                        LabelTitle='Address Line 2'
                                        onChangeText={this.onaddress1Change}
                                        value={addressName2.value}
                                        ref={ref => this.address2Input = ref}
                                        reference='address2Ref'
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => this.cityInput.refs.cityRef.focus()}
                                    />
                                    {addressName2.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{addressName2.message}</Label>
                                        </View>
                                    }
                                </View>

                                <View style={{ zIndex: -1111 }}>
                                    <TextField
                                        placeholder='Enter City'
                                        LabelTitle='City'
                                        onChangeText={this.onTownCityChange}
                                        value={towncity.value}
                                        ref={ref => this.cityInput = ref}
                                        reference='cityRef'
                                        returnKeyType={"next"}
                                        onSubmitEditing={() => this.regionInput.refs.regionRef.focus()}
                                    />
                                    {towncity.message !== "" &&
                                        <View style={Globals.isIpad ? GlobalStyles.errorTxtPad : GlobalStyles.errorTxt}>
                                            <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                            <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10 }}>{towncity.message}</Label>
                                        </View>
                                    }
                                </View>
                                <View style={{ zIndex: -11111 }}>
                                    <TextField
                                        placeholder='Region'
                                        LabelTitle='Region'
                                        onChangeText={this.onregionChange}
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
                                <View style={{ zIndex: -11111 }}>
                                    <DropDownCustom type='country' value={this.state.countryName} labelTitle='Country' Title='Select Country' options={[]}
                                        onOptionChange={(country) => {
                                            console.log("Country", country.iso2)
                                            this.postalInput.refs.postalRef.focus();

                                            this.setState({ country: country.iso2, countryName: country.name })
                                        }} >
                                    </DropDownCustom>
                                </View>
                                <View style={{ zIndex: -111111 }}>
                                    <TextField
                                        placeholder='Enter Postal Code'
                                        LabelTitle='Postal Code'
                                        onChangeText={this.onPostalCodeChange}
                                        value={postalcode.value}
                                        ref={ref => this.postalInput = ref}
                                        reference='postalRef'
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
                                style={{ backgroundColor: this.isSubmitDisable() ? Color.GreyLightColor : Color.Yellow, marginTop: 20, marginBottom: 40, width: (Globals.isIpad ? 400 : "100%"), alignItems: "center", justifyContent: "center", height: 48, zIndex: -11111 }}
                                disabled={this.isSubmitDisable()}
                            />
                            <TouchableOpacity onPress={() => {
                                this.props.navigation.navigate(Routes.uboPersonDetails)
                            }} style={{ marginTop: -20, marginBottom: 20 }}>
                                <Label fontSize_16 color={Color.DarkBlue} Montserrat_Medium>SKIP</Label>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                    <ToastMessage message={this.state.message} isVisible={this.state.isShowToast} />
                    {isLoading && <ProgressHud />}
                </SafeAreaView>
                <NavigationEvents onWillFocus={this.getUserData} />
            </View>
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

    onhouseNumberChange = (text) => {
        const houseNumber = this.state.houseNumber
        houseNumber.value = text

        if (houseNumber.value.length == 0 || houseNumber.value == "") {
            houseNumber.message = ErrorMessage.addressRequired
            houseNumber.isValid = false
        } else {
            houseNumber.message = ""
            houseNumber.isValid = true
        }
        this.setState({
            houseNumber
        })
    }

    onstreetChange = (text) => {
        const street = this.state.street
        street.value = text
        street.isValid = true
        // if (street.value.length == 0 || street.value == "") {
        //     street.message = ErrorMessage.streetRequired
        //     street.isValid = false
        // } else {
        //     street.message = ""
        //     street.isValid = true
        // }
        this.setState({
            street
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
    onaddressChange = (text) => {
        const addressName1 = this.state.addressName1
        addressName1.value = text
        addressName1.isValid = true
        if (addressName1.value.length == 0 || addressName1.value == "") {
            addressName1.message = ErrorMessage.streetRequired
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
            addressName2.message = ErrorMessage.streetRequired
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

    isSubmitDisable() {
        return !this.state.addressName1.isValid || !this.state.addressName2.isValid || !this.state.towncity.isValid || !this.state.region.isValid || !this.state.country || !this.state.postalcode.isValid
        // return false
    }

    getAccountType = async () => {
        let userData = JSON.parse(await getStoredData(Globals.kUserData))
        if (Globals.isClient) {
            return Accounts.INDIVIUAL
        } else {
            return userData.sAccountType
        }
    }


    onNextClick = async () => {
        let { addressName1, addressName2, region, towncity, country, postalcode, legalDetails } = this.state
        let userData = await getStoredData(Globals.kUserData)
        let legalContactInformation = {}
        legalContactInformation['AddressLine1'] = addressName1.value
        legalContactInformation['AddressLine2'] = addressName2.value
        legalContactInformation['City'] = towncity.value
        legalContactInformation['Region'] = region.value
        legalContactInformation['PostalCode'] = postalcode.value
        legalContactInformation['Country'] = country

        let legalDetailsOb = JSON.parse(legalDetails)
        legalDetailsOb['address'] = legalContactInformation

        try {
            let request = new FormData();
            request.append("userId", Globals.userId);


            request.append("oLegalRepresentativeDetail", JSON.stringify(legalDetailsOb));
            console.log("update profile request====>", request)

            let response = await API.editProfileBusiness(request)
            console.log("response", response)
            this.setState({ isLoading: false });
            if (response.status) {
                await setStoredData(Globals.kUserData, JSON.stringify(response.data))
                Globals.userId = response.data._id
                Globals.countryCode = response.data.nCountryCode
                Globals.isBuilder = (response.data._UserRoleId == Users.BUILDER) ? true : false
                Globals.isProfileCompleted = response.data.isProfileCompleted
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
            this.props.navigation.navigate(Routes.uboPersonDetails)


            // this.props.navigation.navigate(Routes.Financial_Information)
        } catch (error) {
            console.log("editProfile error", error.message);
            this.setState({ isLoading: false });
        }


        // await getStoredData(Globals.kUserData).then(value => {
        //     let result = JSON.parse(value)
        //     console.log("email.value", this.state.email)
        //     console.log("email.value", this.state.houseNumber)
        //     if (result) {
        //         const { countryCode, phoneNumber, email, houseNumber, street, towncity } = this.state;
        //         result.nCountryCode = countryCode
        //         result.nPhoneNumber = phoneNumber.value
        //         result.sEmail = email.value
        //         result.sAddressLine1 = houseNumber.value
        //         result.sAddressLine2 = street.value
        //         result.sTownCity = towncity.value
        //         setStoredData(Globals.kUserData, JSON.stringify(result))
        //     }
        // })

    }
}

