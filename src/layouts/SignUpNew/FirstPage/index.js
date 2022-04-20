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
import ProgressHud from '../../../components/ProgressHud';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import GlobalStyles from '../../../utils/GlobalStyles';
import AsyncStorage from '@react-native-community/async-storage';

const images = {
    logoImage: require('./../../../assets/Images/logo.png')
}

const FirstPage = (props, navigation) => {
    const { navigate } = navigation;
    // const { style, isChecked, titleStyle, title, onPress, disabled } = props;

    const [signUpAs, setSignUpAs] = useState('')
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView scrollEnabled={true} enableOnAndroid={true} contentContainerStyle={Globals.isIpad ? styles.scrollViewPad : styles.scrollView}>
                <View style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
                    <Image source={images.logoImage} style={Globals.isIpad ? styles.logoStylePad : styles.logoStyle} />
                </View>
                <View style={Globals.isIpad ? styles.mainViewPad : styles.mainView}>
                    <Label fontSize_16 Montserrat_Medium color={Color.BLACK} mb={6} style={{ lineHeight: 24 }} >Welcome to PongoPay!</Label>
                    <Label fontSize_14 Montserrat_Regular color={Color.BLACK} mb={6} style={{ lineHeight: 22 }} >The safest and easiest way to carry out building transactions. Save hours of time and take the hassle out of construction payments.</Label>


                    <View style={styles.centerView}>
                        <Label weight300 fontSize_20 Montserrat_Light color={Color.DarkGrey}>How would you like to sign up?</Label>
                        <View style={styles.btnSelectionView}>
                            <TouchableOpacity style={[styles.btnSelection, { backgroundColor: signUpAs == 'Individual' ? Color.Yellow : Color.GreyLightColor }]}
                                onPress={() => { setSignUpAs('Individual') }}
                            >
                                <Label
                                    color={signUpAs === 'Individual' ? Color.BLACK : Color.DarkGrey}
                                    weight500
                                    fontSize_16>
                                    Individual
                                </Label>


                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <TouchableOpacity style={[styles.btnSelection, { backgroundColor: signUpAs == 'Business' ? Color.Yellow : Color.GreyLightColor }]}
                                onPress={() => { setSignUpAs('Business') }}
                            >
                                <Label
                                    color={signUpAs === 'Business' ? Color.BLACK : Color.DarkGrey}
                                    weight500
                                    fontSize_16>
                                    Business
                                </Label>
                            </TouchableOpacity>
                        </View>
                        {signUpAs !== '' && <View style={{ marginTop: 16 }}>
                            {signUpAs == 'Individual' && <View style={styles.labeldotView}>
                                <View style={styles.dot} />
                                <Label fontSize_14 Montserrat_Regular color={Color.BLACK}>
                                    Suitable for Individuals and Sole Traders
                                </Label>
                            </View>}
                            {signUpAs == 'Business' && <View style={styles.labeldotView}>
                                <View style={styles.dot} />
                                <Label weight400 fontSize_14 Montserrat_Regular color={Color.BLACK}>
                                    Suitable for Limited Companies
                                </Label>
                            </View>}
                            {signUpAs == 'Business' && <View style={styles.labeldotView}>
                                <View style={styles.dot} />
                                <Label weight400 fontSize_14 Montserrat_Regular color={Color.BLACK}>
                                    Must Have Valid Companies House Number
                                </Label>
                            </View>}
                        </View>}
                    </View>

                </View>
                <View style={styles.btnPos}>
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title="LET’S GET STARTED"
                        textStyle={{ padding: 0 }}
                        style={[styles.lastMainBtn, { backgroundColor: signUpAs !== '' ? Color.Yellow : Color.GreyLightColor }]}
                        onPress={async () => {
                            await AsyncStorage.setItem('AccountType', signUpAs);
                            props.navigation.navigate(Routes.PhoneNumScreen, { SaveAccountType: signUpAs })
                        }}
                        disabled={signUpAs === ''}
                    />
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.DarkBlue} title="I’m an existing user"
                        style={styles.linkBtn}
                        onPress={() => props.navigation.navigate(Routes.Login)}
                    />
                </View>
            </KeyboardAwareScrollView>

        </SafeAreaView >
    )
}


FirstPage['navigationOptions'] = ({ navigation }) => ({
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
export default FirstPage;