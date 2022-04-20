
import React from 'react';
import { View, SafeAreaView, Image } from 'react-native';
import Color from '../../utils/color';
import Label from '../Label';
import styles from "./styles";
import { getUserName, getUserEmail, getUserPhoneNo, getUserPhoto } from "../../utils/getUserName";

const UserDetails = ({ client, title }) => {
    return (
        <SafeAreaView>
            <View style={styles.navigationInsideStyle}>
                <View style={{ marginRight: 10 }}>
                    <Image source={getUserPhoto(client)} style={{ width: 48, aspectRatio: 1, borderRadius: 48 / 2, }} />
                </View>
                <View>
                    <View style={{ flexDirection: "row", paddingBottom: 4 }}>
                        <Label Montserrat_Medium fontSize_14 color={Color.BLACK}>{title + ":"}</Label>
                        <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey} ml={4}>{getUserName(client)}</Label>
                    </View>
                    <View style={{ flexDirection: "row", paddingBottom: 4 }}>
                        <Label Montserrat_Medium fontSize_14 color={Color.BLACK}>Email:</Label>
                        <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey} ml={4}>{getUserEmail(client)}</Label>
                    </View>
                    <View style={{ flexDirection: "row", paddingBottom: 4 }}>
                        <Label Montserrat_Medium fontSize_14 color={Color.BLACK} >Phone Number:</Label>
                        <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey} ml={4}>{getUserPhoneNo(client)}</Label>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default UserDetails;
