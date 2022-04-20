/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color'
import HeaderLeft from '../../components/Header/HeaderLeft';
import HeaderTitle from '../../components/Header/HeaderTitle';
import styles from "./styles"
import Globals, { getCountryFromIso, getAddress } from "../../utils/Globals";
import SearchBar from '../../components/searchbar';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import pongopayFontConfige from '../../../selection.json';
import { fontLarge22, fontXSmall16 } from '../../utils/theme';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import moment from 'moment';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const Icon = createIconSetFromIcoMoon(pongopayFontConfige);
const images = {
    logoImage: require('../../assets/Images/profile_dummy.png')
}

export default class PropertyManagerDetails extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <HeaderTitle title={"My Property Manager"} />,
        }
    };

    constructor(props) {
        super(props)
        const { params = {} } = props.navigation.state;

        this.state = {
            userDetails: params.userDetails,
        }
    }
    render() {

        const { navigate } = this.props.navigation;
        let { userDetails } = this.state
        console.log(userDetails.houseNo == null)
        let houseNo, street, city, country, postalCode
        console.log("USERDETAILS", userDetails)

        let address = getAddress(userDetails.oAddress)
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={{ paddingTop: 32, paddingBottom: 50, alignItems: "center", justifyContent: "center" }}>
                            <Image source={userDetails.profilePic != null ? { uri: userDetails.profilePic } : LocalImages.Client_User} style={{ borderRadius: 67, width: 134, height: 134, }} />
                        </View>
                        <View style={styles.listMain}>
                            <View style={{ flexDirection: "row", paddingBottom: 10, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK}>Full Name:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{userDetails.name}</Label>
                            </View>
                            <View style={{ flexDirection: "row", paddingBottom: 10, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK}>Email:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{userDetails.email}</Label>
                            </View>
                            {/* <View style={{ flexDirection: "row", }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK}>Date of Birth:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{moment(userDetails.dob).format('DD-MM-YYYY')}</Label>
                            </View> */}
                        </View>
                        <View style={styles.listMain}>
                            <View style={{ flexDirection: "row", paddingBottom: 10, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK}>Phone Number:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{"+" + userDetails.countryCode + " " + userDetails.phoneNumber}</Label>
                            </View>
                            <View>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} style={{ position: 'absolute', top: 0, left: 0, }}>Address:</Label>

                                {/* <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} style={Globals.isIpad ? styles.addressPad : styles.addressMobile} >1930  Freed Drive, Arvada, Colorado,
                                80002.</Label> */}

                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} style={Globals.isIpad ? styles.addressPad : styles.addressMobile} >{address}</Label>
                            </View>
                        </View>
                        <View style={[styles.listMain, { borderBottomWidth: 0 }]}>
                            <View style={{ flexDirection: "row", paddingBottom: 10, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK}>Commission:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{userDetails.commission + "%"}</Label>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
            </View >
        );
    }

}

