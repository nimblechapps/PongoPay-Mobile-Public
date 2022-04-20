/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import Label from '../../../components/Label';
import Color from '../../../utils/color'
import HeaderTitle from '../../../components/Header/HeaderTitle';
import styles from "./styles"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import pongopayFontConfige from '../../../../selection.json';
const Icon = createIconSetFromIcoMoon(pongopayFontConfige);

export default class MilestoneUpdates extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => <HeaderTitle title={"Milestones Updates"} />,
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={{ paddingRight: 16, paddingLeft: 16, paddingTop: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey, }}>
                            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Updated Amount:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>£ 65,877</Label>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Updated On:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>July 15, 2019</Label>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Updated By:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>Osmund Cairney (Tradesperson)</Label>
                            </View>
                            <View>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Comments:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} mt={5}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Label>
                            </View>
                        </View>
                        <View style={{ paddingRight: 16, paddingLeft: 16, paddingTop: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey, }}>
                            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Updated Amount:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>£ 64,700</Label>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Updated On:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>July 10, 2019</Label>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Updated By:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>Osmund Cairney (Tradesperson)</Label>
                            </View>
                            <View>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Comments:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} mt={5}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Label>
                            </View>
                        </View>



                    </KeyboardAwareScrollView>
                </SafeAreaView>
            </View >
        );
    }
}

