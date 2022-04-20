import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Image, Text, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import Label from '../../../components/Label'
import Color from "../../../utils/color"
import Globals, { ErrorResponse } from "../../../utils/Globals";
import KMButton from '../../../components/KMButton';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import ToastMessage from '../../components/toastmessage';
import { Routes } from '../../../utils/Routes';
import GlobalStyles from '../../../utils/GlobalStyles';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import { Dropdown } from 'react-native-material-dropdown';
import countryData from "../../../../countries.json";
import { fontNormal20, screenHeight } from '../../../utils/theme';
import API from '../../../API';
import AsyncStorage from '@react-native-community/async-storage';
import ProgressHud from '../../../components/ProgressHud';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { setStoredData } from '../../../utils/store';

const images = {
    logoImage: require('./../../../assets/Images/logo.png')
}


const NameScreen = (props, navigation) => {
    const { navigate } = navigation;

    const [nationality, setNationality] = useState('British, UK')
    const [nationalityCode, setNationalityCode] = useState('gb')

    const [showLoader, setLoader] = useState(false);
    const [accountType, SetAccountType] = useState();
    const getValues = (item) => {
        return item.nationality

    }
    useEffect(() => {
        getAccountType();
    }, [])

    const getAccountType = async () => {
        let accountType = await AsyncStorage.getItem('AccountType');
        SetAccountType(accountType);
    }


    const AddNationalityIndividual = async () => {
        let id = await AsyncStorage.getItem("UserKey");
        let params = {
            userId: id,
            sNationality: nationalityCode.toUpperCase(),
            currentStep: Routes.BusinessAddress
        };
        console.log("===params  Passed", params);
        try {
            let response = await API.editProfileIndividual(params);
            console.log("===params  Passed", response);

            setLoader(false);
            if (response.status) {
                await setStoredData(Globals.kUserData, JSON.stringify(response.data))
                props.navigation.navigate(Routes.BusinessAddress, {
                    accountType: accountType
                })
            }
            else {
                alert("Please enter the Valid Information")
            }
        } catch (err) {
            alert("Please Check the Connection")
            setLoader(false);
        }

    }

    const AddNationalityBusiness = async () => {
        let id = await AsyncStorage.getItem("UserKey");
        console.log("==The user Id is", id);

        let params = {
            userId: id,
            sNationality: nationalityCode.toUpperCase(),
            currentStep: Routes.BusinessAddress

        };
        console.log("===params passed", params);

        try {
            let response = await API.editProfileBusiness(params);
            console.log("===BUSINESS NATIONALITY", response);
            setLoader(false);
            if (response.status) {
                await setStoredData(Globals.kUserData, JSON.stringify(response.data))
                props.navigation.navigate(Routes.BusinessAddress, {
                    accountType: accountType
                })
            }
            else {
                alert("Please enter the valid Information")
            }
        } catch (err) {
            alert("Please Check the Connection");
            setLoader(false);
        }

    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={GlobalStyles.topCustomHeader}>
                <HeaderLeft
                    iconName="left-arrow"
                    onPress={() => {
                        props.navigation.goBack();
                    }}
                />
            </View>
            <KeyboardAwareScrollView scrollEnabled={false} enableOnAndroid={true} contentContainerStyle={styles.scrollView}>
                <View style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
                    <Image source={images.logoImage} style={styles.logoStyle} />
                </View>
                <View style={styles.mainView}>
                    <View style={styles.centerView}>
                        <Label fontSize_20 Montserrat_Light color={Color.DarkGrey}>Select your nationality </Label>
                        <View style={{ position: 'relative' }}>
                            <Dropdown
                                fontSize={fontNormal20}
                                textColor={Color.DarkGrey}
                                rippleOpacity={0}
                                data={countryData}
                                dropdownOffset={{ top: Platform.OS === 'android' ? 97 : 60 }}
                                pickerStyle={{ position: 'absolute', width: '90%', left: 20 }}
                                containerStyle={{ top: -40, }}
                                baseColor={Color.BLACK}
                                valueExtractor={(item) => getValues(item)}
                                value={nationality}
                                onChangeText={(value, index) => {
                                    const nationalityCode = countryData.find((item) => {
                                        return item.nationality == value
                                    })
                                    setNationality(value)
                                    setNationalityCode(nationalityCode.iso2)
                                }}
                            />

                            {nationality === '' && <View style={{ position: 'absolute', left: 1, top: 15, zIndex: -1, elevation: -1 }}>
                                <Label fontSize_24 Montserrat_Light color={Color.LightGrey}>Nationality</Label>
                            </View>}

                        </View>
                    </View>
                </View>


                <View style={styles.btnPos}>
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title="NEXT"
                        textStyle={{ padding: 0 }}
                        disabled={nationality === ''}
                        style={[styles.lastMainBtn, { backgroundColor: nationality === '' ? Color.GreyLightColor : Color.Yellow }]}
                        onPress={() => {
                            setLoader(true);
                            {
                                accountType === 'Individual' ?
                                    AddNationalityIndividual()
                                    :
                                    AddNationalityBusiness()
                            }
                        }}
                    />
                </View>
            </KeyboardAwareScrollView>
            {showLoader && <ProgressHud />}
        </SafeAreaView >
    )
}

NameScreen['navigationOptions'] = ({ navigation }) => ({
    headerShown: false
})

export default NameScreen;