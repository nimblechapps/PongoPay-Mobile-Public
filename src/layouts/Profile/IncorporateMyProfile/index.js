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
import HeaderLeft from '../../../components/Header/HeaderLeft';
import HeaderTitle from '../../../components/Header/HeaderTitle';
import HeaderRight from '../../../components/Header/HeaderRight';
import styles from "./styles"
import Globals, { isValidValue, isValidIntValue } from "../../../utils/Globals";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Routes } from '../../../utils/Routes';
import LocalImages from '../../../utils/LocalImages';
import { getStoredData } from '../../../utils/store';
import moment from 'moment';

export default class IncorporateMyProfile extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (
                <HeaderLeft
                    iconName="burger_menu"
                    onPress={() => {
                        navigation.toggleDrawer()
                    }}
                />
            ),
            headerTitle: () => <HeaderTitle title={"My Profile"} />,
            headerRight: (
                <HeaderRight
                    buttonTitle="Edit"
                    onPress={() => {
                        navigation.navigate(Routes.Personal_Information);
                    }}
                />
            ),
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            userPhoto: LocalImages.Profile,
            userSignature: LocalImages.Signature,

            fullName: "",
            companyName: "",
            dateofBirth: "",

            phoneNumber: "",
            email: "",
            address1: "",
            address2: "",

            bankAccNo: ""
        }
    }

    getUserData = () => {
        getStoredData(Globals.kUserData).then(value => {
            let result = JSON.parse(value)
            console.log("MyProfile UserData", result)
            if (result) {
                const userPhoto = isValidValue(result.sProfilePic) ? { uri: result.sProfilePic } : LocalImages.Profile
                const userSignature = isValidValue(result.signature) ? { uri: result.signature } : LocalImages.Signature

                const fullName = result.sFirstName + " " + result.sLastName
                const companyName = isValidValue(result.sCompanyName) ? result.sCompanyName : ""
                console.log("my profile dDateofBirth", result.dDateofBirth)
                // const dateofBirth = isValidValue(result.dDateofBirth) ? moment(result.dDateofBirth,'MM-DD-YYYY').format(Globals.kDatePickerFormat) : ""
                const dateofBirth = isValidValue(result.dDateofBirth) ?
                    moment(result.dDateofBirth, 'MM-DD-YYYY', true).isValid() ?
                        moment(result.dDateofBirth, 'MM-DD-YYYY').format(Globals.kDatePickerFormat) : moment(result.dDateofBirth).format(Globals.kDatePickerFormat)
                    : ""

                const phoneNumber = isValidValue(result.nPhoneNumber) ? result.nPhoneNumber : ""
                const email = isValidValue(result.sEmail) ? result.sEmail : ""
                const address1 = isValidValue(result.sAddressLine1) ? result.sAddressLine1 : ""
                const address2 = isValidValue(result.sAddressLine2) ? result.sAddressLine2 : ""

                const bankAccNo = isValidIntValue(result.nBankAccNo) ? result.nBankAccNo : ""

                this.setState({
                    userPhoto,
                    userSignature,

                    fullName,
                    companyName,
                    dateofBirth,

                    phoneNumber,
                    email,
                    address1,
                    address2,

                    bankAccNo
                })
            }
        })
    }

    render() {
        const { userPhoto, userSignature, fullName, companyName, dateofBirth, phoneNumber, email, address1,
            address2, bankAccNo } = this.state;

        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={styles.profileSignature}>
                            <Image style={styles.userPhotoStyle}
                                source={userPhoto} />

                        </View>
                        <View style={styles.informationDetails}>
                            <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>Professional Information</Label>
                            <View style={styles.borderLine}></View>
                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Company Number:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>7458204896</Label>
                                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{companyNumber}</Label> */}
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Company Name:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>Revamp Consultancy LLC</Label>
                                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{companyName}</Label> */}
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Email:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{email}</Label>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Phone:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{phoneNumber}</Label>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Tax Country:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>United States of America</Label>
                                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{companyName}</Label> */}
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6 }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Trading Name:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>Ace & Hammer Builders </Label>
                                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{address1}</Label> */}
                            </View>

                        </View>
                        <View style={[styles.informationDetails, { marginTop: 32, marginBottom: 20, }]}>
                            <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>Financial Information</Label>
                            <View style={styles.borderLine}></View>
                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Bank Acc:</Label>
                                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>1000356786667</Label> */}
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{bankAccNo}</Label>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Sort Code:</Label>
                                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>1000356786667</Label> */}
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>202645</Label>
                            </View>
                            {/* <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Commission:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>20%</Label>
                            </View> */}
                        </View>
                        <View style={[styles.informationDetails, { marginTop: 10 }]}>
                            <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>Trading Address</Label>
                            <View style={styles.borderLine}></View>

                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6 }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Address:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>Address: 1591 Mulberry Street Houston United States of America</Label>
                                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{address1}</Label> */}
                            </View>

                        </View>
                        <View style={[styles.informationDetails, { marginTop: 32 }]}>
                            <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>Registered Address</Label>
                            <View style={styles.borderLine}></View>

                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6 }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Address:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>1591 Mulberry Street Houston United States of America </Label>
                                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{address1}</Label> */}
                            </View>

                        </View>
                        <View style={[styles.informationDetails, { marginTop: 32 }]}>
                            <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>Primary Business Person Details</Label>
                            <View style={styles.borderLine}></View>

                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Full Name:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>John Doe</Label>
                                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{fullName}</Label> */}
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>DOB:</Label>
                                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>12/17/1991</Label> */}
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{dateofBirth}</Label>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6 }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Address:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>4163  Ashcraft Court, San Diego</Label>
                                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{address1}</Label> */}
                            </View>
                        </View>
                        <View style={[styles.informationDetails, { marginTop: 32 }]}>
                            <Label fontSize_16 Montserrat_Medium color={Color.BLACK}>Secondary Business Person Details</Label>
                            <View style={styles.borderLine}></View>

                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Full Name:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>John Doe</Label>
                                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{fullName}</Label> */}
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>DOB:</Label>
                                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>12/17/1991</Label> */}
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{dateofBirth}</Label>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 6, marginBottom: 6 }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} mr={5}>Address:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}> 3667 Boring Lane Los Angeles United States of America </Label>
                                {/* <Label fontSize_14 Montserrat_Medium color={Color.GreenGrey}>{address1}</Label> */}
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
                <NavigationEvents onWillFocus={this.getUserData} />
            </View >
        );
    }
}


