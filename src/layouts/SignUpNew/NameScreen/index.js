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


const images = {
    logoImage: require('./../../../assets/Images/logo.png')
}


const NameScreen = (props, navigation) => {
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

    const onNameChange = text => {
        const nameValue = name;
        nameValue.value = text.trim()

        if (nameValue.value.length == 0 || nameValue.value == '') {
            nameValue.message = ErrorMessage.firstNameRequired;
            nameValue.isValid = false;
        } else if (!validateName(nameValue.value)) {
            nameValue.message = ErrorMessage.firstNameInvalid;
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
    const onSurnameChange = text => {
        const surnameValue = surname;
        surnameValue.value = text.trim()

        if (surnameValue.value.length == 0 || surnameValue.value == '') {
            surnameValue.message = ErrorMessage.surNameRequired;
            surnameValue.isValid = false;
        } else if (!validateName(surnameValue.value)) {
            surnameValue.message = ErrorMessage.lastNameInvalid;
            surnameValue.isValid = false;
        } else {
            surnameValue.message = '';
            surnameValue.isValid = true;
        }
        const newObj = {
            value: surnameValue.value,
            message: surnameValue.message,
            isValid: surnameValue.isValid
        }
        setSurname(newObj)
    };

    const AddIndividualName = async () => {

        console.log("==ADD INDIVIDUAL NAME");

        let id = await AsyncStorage.getItem('UserKey');
        console.log("The User ID is", id);
        let token = await AsyncStorage.getItem('UserToken');
        console.log("The User token is", token);

        let params = { userId: id, sFirstName: name.value, sLastName: surname.value, currentStep: Routes.ProfileScreen }
        console.log("The params We get", params);

        try {
            let response = await API.editProfileIndividual(params);
            console.log("The response of the data", response);
            setLoader(false);
            if (response.status) {
                await setStoredData(Globals.kUserData, JSON.stringify(response.data))
                props.navigation.navigate(Routes.ProfileScreen, {
                    firstname: name.value,
                    surname: surname.value
                });
            }
            else {
                alert("Please check the entered data");
            }
        } catch (err) {
            alert("Please Check the data")
            setLoader(false);
        }

    }

    const AddBusinessName = async () => {
        console.log("===ADD BUSINESS NAME")

        let id = await AsyncStorage.getItem('UserKey');
        console.log("The User Id is", id);

        let params = { userId: id, sFirstName: name.value, sLastName: surname.value, currentStep: Routes.ProfileScreen }
        console.log("=== THE PARAMS WE GET", params);

        try {
            let response = await API.editProfileBusiness(params);
            console.log("===BUSINESS NAME", response);
            setLoader(false);
            if (response.status) {
                await setStoredData(Globals.kUserData, JSON.stringify(response.data))
                props.navigation.navigate(Routes.ProfileScreen, {
                    firstname: name.value,
                    surname: surname.value
                });
            }
            else {
                alert("Please enter the Correct Information")
            }
        } catch (err) {
            alert("Please try Again")
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
                        setLoader(false);
                    }}
                />
            </View>
            <KeyboardAwareScrollView scrollEnabled={true} enableOnAndroid={true} contentContainerStyle={styles.scrollView}>
                <View style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
                    <Image source={images.logoImage} style={styles.logoStyle} />
                </View>
                <View style={styles.mainView}>
                    <View style={styles.centerView}>
                        <Label fontSize_20 Montserrat_Light color={Color.DarkGrey}>Great! Now enter your full name </Label>
                        <View>
                            <TextField
                                placeholder='First name'
                                onChangeText={onNameChange}
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
                            <TextField
                                placeholder='Surname'
                                onChangeText={onSurnameChange}
                                customStyle={GlobalStyles.textFieldStyle}
                                labelStyle={{ marginBottom: 0 }}
                                value={surname}
                            >
                                {surname.message !== "" &&
                                    <View style={GlobalStyles.newErrorView}>
                                        <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                        <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{surname.message}</Label>
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
                        disabled={(!name.isValid || !surname.isValid)}
                        style={[styles.lastMainBtn, { backgroundColor: (!name.isValid || !surname.isValid) ? Color.GreyLightColor : Color.Yellow }]}
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

NameScreen['navigationOptions'] = ({ navigation }) => ({
    headerShown: false
})

export default NameScreen;