/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color';
import HeaderTitle from '../../components/Header/HeaderTitle';
import KMButton from "../../components/KMButton";
import GlobalStyles from '../../utils/GlobalStyles';
import { Routes } from '../../utils/Routes';
import styles from "./styles";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Globals, { Users } from '../../utils/Globals';

export default class ContractModificationRequests extends Component {
    static navigationOptions = ({ }) => {
        return {
            headerTitle: () => <HeaderTitle title={"Modification Requests"} />,
        }
    };

    constructor(props) {
        super(props)
        this.state = {

        }
    };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <KeyboardAwareScrollView>
                        <View style={{ paddingRight: 16, paddingLeft: 16, paddingTop: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey, }}>

                            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Request Sent On:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>£ July 14, 2019</Label>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Sent By:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>Johnathan Rigeby (Client)</Label>
                            </View>
                            <View>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Comments:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} mt={5}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Label>
                            </View>
                        </View>
                        <View style={{ paddingRight: 16, paddingLeft: 16, paddingTop: 24, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey, }}>
                            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Request Sent On:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>£ July 04, 2019</Label>
                            </View>
                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Sent By:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>Tudor Prendergast (Property Manager)</Label>
                            </View>
                            <View>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Comments:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} mt={5}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Label>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
                {Globals.isBuilder &&
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title="UPDATE CONTRACT"
                        textStyle={{ padding: 0 }}
                        style={[GlobalStyles.bottomButtonStyle, { borderRadius: 0, }]}
                        onPress={() => navigate(Routes.Update_Contract)}
                    />
                }
            </View>
        );
    }
}

