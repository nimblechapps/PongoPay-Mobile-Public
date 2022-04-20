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
import { validateEmail } from '../../../utils/validation';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import CustomIcon from '../../../components/CustomIcon';
import TextField from '../../../components/TextField';
import { fontXSmall16 } from '../../../utils/theme';


const images = {
    logoImage: require('./../../../assets/Images/logo.png')
}


const BusinessEmailScreen = (props, navigation) => {
    const { navigate } = navigation;

    const [businessEmail, setbusinessEmail] = useState({
        value: "",
        message: "",
        isValid: false,
    })

    const onEmailChange = text => {
        const emailAddress = businessEmail;
        emailAddress.value = text.trim()

        if (emailAddress.value.length == 0 || emailAddress.value == '') {
            emailAddress.message = ErrorMessage.businessEmailRequired;
            emailAddress.isValid = false;
        } else if (!validateEmail(emailAddress.value)) {
            emailAddress.message = ErrorMessage.emailInvalid;
            emailAddress.isValid = false;
        } else {
            emailAddress.message = '';
            emailAddress.isValid = true;
        }
        const newObj = {
            value: emailAddress.value,
            message: emailAddress.message,
            isValid: emailAddress.isValid
        }
        setbusinessEmail(newObj)
    };

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
            <KeyboardAwareScrollView scrollEnabled={true} enableOnAndroid={true} contentContainerStyle={Globals.isIpad ? styles.scrollViewPad : styles.scrollView}>
                <View style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
                    <Image source={images.logoImage} style={styles.logoStyle} />
                </View>
                <View style={styles.mainView}>
                    <View style={styles.centerView}>
                        <Label fontSize_20 Montserrat_Light color={Color.DarkGrey}>What’s your business email</Label>
                        <View>
                            <TextField
                                placeholder='business email'
                                onChangeText={onEmailChange}
                                customStyle={{ borderWidth: 0, borderBottomWidth: 1, marginBottom: 10, paddingLeft: 0 }}
                                value={businessEmail}
                                autoFocus={true}

                            >
                                {businessEmail.message !== "" &&
                                    <View style={GlobalStyles.newErrorView}>
                                        <CustomIcon name={"warning"} style={{ color: Color.Red, fontSize: fontXSmall16, alignItems: "center" }} />
                                        <Label fontSize_14 Montserrat_Regular color={Color.DarkGrey} style={{ paddingLeft: 10, }}>{businessEmail.message}</Label>
                                    </View>
                                }
                            </TextField>
                        </View>
                    </View>
                </View>
                <Image source={require('../../../assets/Images/anime/busEmail.png')}
                    style={GlobalStyles.animImageStyle}
                />
                <View style={styles.btnPos}>
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title="NEXT"
                        textStyle={{ padding: 0 }}
                        disabled={!businessEmail.isValid}
                        style={[styles.lastMainBtn, { backgroundColor: businessEmail.isValid ? Color.Yellow : Color.GreyLightColor }]}
                        onPress={() => props.navigation.navigate(Routes.BankDetailsScreen)}
                    />
                </View>

            </KeyboardAwareScrollView>

        </SafeAreaView >
    )
}

BusinessEmailScreen['navigationOptions'] = ({ navigation }) => ({
    headerShown: false
})

export default BusinessEmailScreen;  