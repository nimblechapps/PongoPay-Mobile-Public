/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, Image } from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color'
import LocalImages from '../../utils/LocalImages';
import HeaderTitle from '../../components/Header/HeaderTitle';
import styles from "./styles"
import Globals, { Users, getAddress } from "../../utils/Globals";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';

const images = {
    logoImage: require('../../assets/Images/Client_man.png')
}

export default class ClientsDetails extends Component {

    static navigationOptions = ({ }) => {
        const title = Globals.isBuilder ? "My Clients" : "My Tradesperson"
        return {
            headerTitle: () => <HeaderTitle title={title} />,
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
        let { userDetails } = this.state
        let houseNo, street, city, country, postalCode
        console.log("USERDETAILS", userDetails)
        let address = getAddress(userDetails.oAddress)
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={{ paddingTop: 32, paddingBottom: 50, alignItems: "center", justifyContent: "center" }}>
                            <Image source={userDetails.userProfilePic != null ? { uri: userDetails.userProfilePic } : LocalImages.Client_User} style={{ borderRadius: 67, width: 134, height: 134, }} />
                        </View>
                        <View style={styles.listMain}>
                            <View style={{ flexDirection: "row", paddingBottom: 10, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK}>Full Name:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{userDetails.userName}</Label>
                            </View>
                            <View style={{ flexDirection: "row", paddingBottom: 10, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK}>Email:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{userDetails.userEmail}</Label>
                            </View>
                            {userDetails.dob && <View style={{ flexDirection: "row", }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK}>Date of Birth:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}> {moment(userDetails.dob).format('DD-MM-YYYY')}</Label>
                            </View>}
                        </View>
                        <View style={styles.listMain}>
                            <View style={{ flexDirection: "row", paddingBottom: 10, }}>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK}>Phone Number:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{"+" + userDetails.userCountryCode + " " + userDetails.userPhoneNumber} </Label>
                            </View>
                            <View>
                                <Label fontSize_14 Montserrat_Medium color={Color.BLACK} style={{ position: 'absolute', top: 0, left: 0, }}>Address:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} style={Globals.isIpad ? styles.addressPad : styles.addressMobile} >{address}</Label>
                            </View>
                        </View>

                    </KeyboardAwareScrollView>
                </SafeAreaView>
            </View>
        );
    }
}

