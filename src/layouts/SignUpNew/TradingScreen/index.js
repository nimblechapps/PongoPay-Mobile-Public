import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Image, Text, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import Label from '../../../components/Label'
import Color from "../../../utils/color"
import Globals, { ErrorResponse } from "../../../utils/Globals";
import KMButton from '../../../components/KMButton';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Routes } from '../../../utils/Routes';
import GlobalStyles from '../../../utils/GlobalStyles';
import { ErrorMessage } from '../../../utils/message';
import { validateCharacter, validateName, validateEmail } from '../../../utils/validation';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import CustomIcon from '../../../components/CustomIcon';
import TextField from '../../../components/TextField';
import { fontLarge24, fontXSmall16 } from '../../../utils/theme';
import AsyncStorage from '@react-native-community/async-storage';
import API from '../../../API';
import ProgressHud from '../../../components/ProgressHud';
import { setStoredData } from '../../../utils/store';
import HeaderRight from '../../../components/Header/HeaderRight';


const images = {
    logoImage: require('./../../../assets/Images/logo.png')
}


const TradingScreen = (props, navigation) => {
    const { navigate } = navigation;
    const [accountType, SetAccountType] = useState();
    const [showLoader, setLoader] = useState(false)

    const [name, setName] = useState({
        value: "",
        message: "",
        isValid: false,
    })
    const [surname, setSurname] = useState({
        value: "",
        message: "",
        isValid: false,
    })

    useEffect(() => {
        getAccountType();
    }, [])

    const getAccountType = async () => {
        let accountType = await AsyncStorage.getItem('AccountType');
        SetAccountType(accountType);
    }

    const onTradingNameChange = text => {
        const nameValue = name;
        nameValue.value = text.trim()

        if (nameValue.value.length == 0 || nameValue.value == '') {
            nameValue.message = ErrorMessage.tradingNameRequired;
            nameValue.isValid = false;
        } else if (!validateName(nameValue.value)) {
            nameValue.message = ErrorMessage.tradingNameInvalid;
            nameValue.isValid = false;
        } else {
            nameValue.message = '';
            nameValue.isValid = true;
        }
        const newObj = {
            value: nameValue.value,
            message: nameValue.message,
            isValid: nameValue.isValid
        }
        setName(newObj)
    };


    const AddIndividualName = async () => {

        console.log("==ADD INDIVIDUAL NAME");

        let id = await AsyncStorage.getItem('UserKey');
        console.log("The User ID is", id);
        let token = await AsyncStorage.getItem('UserToken');
        console.log("The User token is", token);

        let params = { userId: id, sFirstName: name.value, sLastName: surname.value, currentStep: Routes.ProfileScreen }
        console.log("The params We get", params);
        props.navigation.navigate(Routes.DOBScreen, {
            tradingName: name.value,
        });

    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={GlobalStyles.topCustomHeader}>
                <HeaderLeft
                    iconName="left-arrow"
                    onPress={() => {
                        props.navigation.goBack();
                        setLoader(false);
                    }}
                />
                <HeaderRight
                    buttonTitle="Skip"
                    buttonColor={Color.DarkGrey}
                    buttonStyle={{ fontSize: fontXSmall16, color: Color.DarkGrey, fontFamily: "Montserrat-Medium", fontWeight: '500' }}
                    onPress={() => {
                        setLoader(false)
                        props.navigation.navigate(Routes.DOBScreen);
                    }}
                />
            </View>
            <KeyboardAwareScrollView scrollEnabled={true} enableOnAndroid={true} contentContainerStyle={styles.scrollView}>
                <View style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
                    <Image source={images.logoImage} style={styles.logoStyle} />
                </View>
                <View style={styles.mainView}>
                    <View style={styles.centerView}>
                        <Label fontSize_20 Montserrat_Light color={Color.DarkGrey}>Great! Now enter your trading name </Label>
                        <View>
                            <TextField
                                placeholder='Trading name'
                                onChangeText={onTradingNameChange}
                                customStyle={GlobalStyles.textFieldStyle}
                                labelStyle={{ marginBottom: 0 }}
                                value={name}
                                autoFocus={true}
                            >
                                {name.message !== "" &&
                                    <View style={GlobalStyles.newErrorView}>
                                        <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                        <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{name.message}</Label>
                                    </View>
                                }
                            </TextField>
                        </View>
                    </View>
                </View>
                <Image source={require('../../../assets/Images/anime/name.png')}
                    style={[GlobalStyles.animImageStyle, styles.AnimImgStyle]}
                />
                <View style={styles.btnPos}>
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title="NEXT"
                        textStyle={{ padding: 0 }}
                        disabled={(!name.isValid)}
                        style={[styles.lastMainBtn, { backgroundColor: (!name.isValid) ? Color.GreyLightColor : Color.Yellow }]}
                        onPress={() => {
                            {
                                accountType === 'Individual' ?
                                    AddIndividualName()
                                    :
                                    AddBusinessName();
                            }

                            setLoader(true);
                        }}
                    />
                </View>

            </KeyboardAwareScrollView>
            {showLoader && <ProgressHud />}
        </SafeAreaView >
    )
}

TradingScreen['navigationOptions'] = ({ navigation }) => ({
    headerShown: false
})

export default TradingScreen;