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
import { fontXSmall16 } from '../../../utils/theme';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import GlobalStyles from '../../../utils/GlobalStyles';

const images = {
    logoImage: require('./../../../assets/Images/logo.png')
}

const CongratsScreen = (props, navigation) => {
    const { navigate } = navigation;
    // const { style, isChecked, titleStyle, title, onPress, disabled } = props;

    const [signUpAs, setSignUpAs] = useState('')

    useEffect(() => {
        Globals.isBuilder = true
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoMainView}>
                <Image source={images.logoImage} style={Globals.isIpad ? styles.logoStylePad : styles.logoStyle} />
            </View>
            <View style={styles.mainView}>
                <Image source={require('../../../assets/Images/anime/groupfrnds.png')} style={styles.frndsStyle} />
                <Label fontSize_16 Montserrat_Bold color={Color.BLACK} mb={6} style={{ lineHeight: 24, textAlign: 'center' }} >Congratulations, you're all set! </Label>
                <Label fontSize_14 Montserrat_Regular color={Color.BLACK} mb={6} style={{ lineHeight: 22, textAlign: 'center' }} >Start making payments with PongoPay to earn rewards and benefits.</Label>
            </View>
            <View style={styles.btnPos}>
                <KMButton
                    fontSize_16 Montserrat_Medium
                    color={Color.BLACK}
                    title="Done"
                    textStyle={{ padding: 0 }}
                    style={[styles.lastMainBtn, { backgroundColor: Color.Yellow }]}
                    onPress={() => props.navigation.navigate(Routes.TutorialScreen)}
                />

            </View>
        </SafeAreaView >
    )
}


CongratsScreen['navigationOptions'] = ({ navigation }) => ({
    headerShown: false
    // headerLeft: (
    //     <HeaderLeft
    //         iconName="left-arrow"
    //         onPress={() => {
    //             navigation.goBack();
    //         }}
    //     />
    // ),
})
export default CongratsScreen;