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
import Globals, { isValidValue, Users, getCountryFromIso, getFormDataObj } from "../../../utils/Globals";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, validatePhone, validatePostalcode } from '../../../utils/validation';
import { ErrorMessage } from '../../../utils/message';
import { fontNormal20, fontXSmall16 } from '../../../utils/theme';
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
import RadioButton from '../../../components/RadioButton';
import { width } from '../../../utils/dimensions';
import AsyncStorage from '@react-native-community/async-storage';



const images = {
    logoImage: require('./../../../assets/Images/anime/icon_owner.png')
}

export default class BusinessOwner extends Component {

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
            has25share: undefined,
            has75share: undefined,
            isLoading: false
        }
    }

    uboYes = async () => {
        this.setState({
            isLoading: true
        })
        let userID = await AsyncStorage.getItem('UserKey');
        const params = {
            userId: userID,
            isLastStep: true,
            has25share: this.state.has25share || false,
            has75share: this.state.has75share || false
        };

        try {
            let response = await API.editProfileBusiness(params);
            this.setState({
                false: true
            })
            if (response.status) {
                await setStoredData(Globals.kUserData, JSON.stringify(response.data))
                this.props.navigation.navigate(Routes.CongratsScreen);
            }
            else {
                alert("Please Check the Information")
            }
        } catch (err) {
            console.log("===Error message", err.message);
        }

    }


    render() {
        const { isLoading, towncity, postalcode, addressName1, addressName2, region } = this.state;
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
                        <HeaderTitle title={'Company information'} />
                        <HeaderRight />
                    </View>
                    <KeyboardAwareScrollView>


                        <View style={styles.informationDetails}>
                            <View style={{ width: (Globals.isIpad ? 400 : "100%") }}>

                                <View style={{ marginVertical: 0 }}>
                                    <Label mb={10} fontSize_16 Montserrat_Medium color={Color.DarkGrey}>Do you own more than 75% of the company?</Label>
                                    <RadioButton
                                        disabled={this.state.isProfileCompleted}
                                        title={'Yes'}
                                        textStyle={{ fontSize: fontNormal20, fontFamily: 'Montserrat-Medium' }}
                                        onChange={() => this.setState({ has75share: true })}
                                        selected={this.state.has75share === true} />
                                    <RadioButton
                                        disabled={this.state.isProfileCompleted}
                                        title={'No'}
                                        textStyle={{ fontSize: fontNormal20, fontFamily: 'Montserrat-Medium' }}
                                        onChange={() => this.setState({ has75share: false })}
                                        selected={this.state.has75share === false} />
                                </View>

                                {/* {this.state.has75share == false && <View style={{ marginVertical: 20 }}>
                                    <Label mb={5} fontSize_16 Montserrat_Regular color={Color.BLACK}> Third person owning more than 25%</Label>
                                    <RadioButton
                                        disabled={this.state.isProfileCompleted}
                                        title={'Yes'}
                                        textStyle={{ fontSize: fontNormal20, fontFamily: 'Montserrat-Medium' }}
                                        onChange={() => this.setState({ has25share: true })}
                                        selected={this.state.has25share === true} />
                                    <RadioButton
                                        disabled={this.state.isProfileCompleted}
                                        title={'No'}
                                        textStyle={{ fontSize: fontNormal20, fontFamily: 'Montserrat-Medium' }}
                                        onChange={() => this.setState({ has25share: false })}
                                        selected={this.state.has25share === false} />
                                </View>} */}

                            </View>

                            <KMButton onPress={() => {
                                if (this.state.has75share) {
                                    // this.props.navigation.navigate(Routes.CongratsScreen)
                                    this.uboYes()
                                } else {
                                    this.props.navigation.navigate(Routes.BusinessUBO1)
                                }

                            }}
                                fontSize_16 Montserrat_Medium
                                color={Color.BLACK}
                                title="NEXT"
                                textStyle={{ padding: 0 }}
                                style={{ backgroundColor: (this.state.has75share === undefined) ? Color.GreyLightColor : Color.Yellow, marginTop: 20, marginBottom: 20, width: (Globals.isIpad ? 400 : "100%"), alignItems: "center", justifyContent: "center", height: 48, zIndex: -11111 }}
                                disabled={(this.state.has75share === undefined)}
                            />

                        </View>
                    </KeyboardAwareScrollView>
                    <ToastMessage message={this.state.message} isVisible={this.state.isShowToast} />
                    {isLoading && <ProgressHud />}
                    <Image resizeMode='cover' source={images.logoImage} style={{ alignSelf: "center", width: width, height: 230 }} />
                </SafeAreaView>

            </View>
        );
    }
}

