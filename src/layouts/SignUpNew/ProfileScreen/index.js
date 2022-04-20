import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Image, Text, Alert, TouchableOpacity, ScrollView } from 'react-native';
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
import ImagePicker from 'react-native-image-crop-picker';
import { fontXSmall16 } from '../../../utils/theme';
import uploadBtn from '../../../assets/Images/camera.png';
import AsyncStorage from '@react-native-community/async-storage';
import API from '../../../API';
import ProgressHud from '../../../components/ProgressHud';
import { setStoredData } from '../../../utils/store';
import HeaderRight from '../../../components/Header/HeaderRight';



const images = {
    logoImage: require('./../../../assets/Images/logo.png')
}


const ProfileScreen = (props, navigation) => {

    const { navigate, screenProps } = navigation;
    const [userPhoto, setuserPhoto] = useState({
        image: uploadBtn,
        path: '',
        style: styles.uploadImg
    })

    const [accountType, SetAccountType] = useState();
    const [showLoader, setLoader] = useState(false)


    useEffect(() => {
        getAccountType();
        setLoader(false)
    }, [])


    const getAccountType = async () => {
        let accountType = await AsyncStorage.getItem('AccountType');
        SetAccountType(accountType);
    }



    const onUploadBtnClick = () => {
        Alert.alert(
            'Document',
            'Select Document',
            [
                {
                    text: 'Take Photo',
                    onPress: () => openCameraPicker(true),
                },
                {
                    text: 'Select From Gallery',
                    onPress: () => openCameraPicker(false),
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    };

    const openCameraPicker = (isCamera = false) => {
        let options = {
            width: 1000,
            height: 1000,
            cropping: true,
            cropperCircleOverlay: true,
            sortOrder: 'none',
            compressImageMaxWidth: 2000,
            compressImageMaxHeight: 1000,
            compressImageQuality: 1,
            mediaType: 'photo',
            includeExif: true,
        };
        if (isCamera) {
            ImagePicker.openCamera(options)
                .then(image => {
                    console.log('received image', image);
                    // const source = { uri: image.path, width: image.width, height: image.height, mime: image.mime }
                    const source = { uri: image.path, mime: image.mime };
                    console.log("==The CAMERA OPENING", source);
                    userPhoto.image = source;
                    userPhoto.path = image.path;
                    userPhoto.style = styles.uploadUserImg
                    console.log("CAMERTA PHOTO IS", userPhoto);
                    setuserPhoto(Object.assign({}, userPhoto));
                })
                .catch(e => {
                    Alert.alert(e.message ? e.message : e);
                });
        } else {
            ImagePicker.openPicker(options)
                .then(image => {
                    console.log('=== Received Image', image);
                    // const source = { uri: image.path, width: image.width, height: image.height, mime: image.mime }
                    const source = { uri: image.path, mime: image.mime };
                    console.log("== SOURCE IS ", userPhoto.image);
                    userPhoto.image = source;
                    userPhoto.path = image.path;
                    userPhoto.style = styles.uploadUserImg
                    console.log("THE USER PHOTO IS", userPhoto);
                    setuserPhoto(Object.assign({}, userPhoto));
                })
                .catch(e => {
                    Alert.alert(e.message ? e.message : e);
                });
        }
    };

    const AddProfilePicIndividual = async () => {
        console.log("==INDIVIDUAL PROFILE PICTURE")
        let id = await AsyncStorage.getItem('UserKey');
        console.log("The User Id is ", id);
        let token = await AsyncStorage.getItem('UserToken');
        console.log("====The user Token is", token);
        console.log("===Image Uploading Data", userPhoto);
        var Photo = {
            uri: userPhoto.image.uri,
            type: 'image/jpeg',
            name: 'profile.jpg'
        }
        console.log("===PHOTO UPLOADING", Photo);

        let request = new FormData();
        request.append('userId', id);
        request.append("sProfilePic", Photo);
        request.append('currentStep', Routes.TradingScreen);

        console.log("===REQUEST DATA", request);

        let response = await API.editProfileIndividual(request);
        setLoader(false);
        console.log("===== response =====", response)

        if (response.status) {
            await setStoredData(Globals.kUserData, JSON.stringify(response.data))
            props.navigation.navigate(Routes.TradingScreen);
            console.log("==Image Uploaded Succefully");
        }
        else {
            alert("Please Check Correct Source");
        }

    }

    const AddProfilePicBusiness = async () => {

        console.log("==BUSINESS PROFILE PICTURE");
        let id = await AsyncStorage.getItem('UserKey');
        console.log("The User Id is", id);

        var Photo = {
            uri: userPhoto.image.uri,
            type: 'image/jpeg',
            name: 'profile.jpg'
        }
        console.log("===Photo Uploading", Photo)

        let request = new FormData();
        request.append('userId', id);
        request.append('sProfilePic', Photo);
        request.append('currentStep', Routes.DOBScreen);


        console.log("==Request Data", request);

        let response = await API.editProfileBusiness(request);
        setLoader(false);
        console.log("===BUSINESS RESPONSE", response);

        if (response.status) {
            await setStoredData(Globals.kUserData, JSON.stringify(response.data))
            props.navigation.navigate(Routes.DOBScreen);
            console.log("===IMAGE UPLOADED");
        }
        else {
            Alert("Please select the Correct Source")
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

                <HeaderRight
                    buttonTitle="Skip"
                    buttonColor={Color.DarkGrey}
                    buttonStyle={{ fontSize: fontXSmall16, color: Color.DarkGrey, fontFamily: "Montserrat-Medium", fontWeight: '500' }}
                    onPress={() => {
                        setLoader(false)
                        props.navigation.navigate(Routes.TradingScreen);
                    }}
                />
            </View>
            <ScrollView scrollEnabled={true} enableOnAndroid={true} contentContainerStyle={styles.scrollView}>
                <View style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
                    <Image source={images.logoImage} style={styles.logoStyle} />
                </View>
                <View style={styles.mainView}>
                    <View style={styles.centerView}>
                        <Label fontSize_20 Montserrat_Light color={Color.DarkGrey}>Upload your profile picture </Label>
                        <View style={styles.profileMainView}>
                            <TouchableOpacity style={styles.uploadBtn} onPress={() => { onUploadBtnClick() }}>
                                <Image source={userPhoto.image}
                                    style={userPhoto.style} />
                                {/* <Image source={userPhoto.image} /> */}
                            </TouchableOpacity>
                            <Label fontSize_24 Montserrat_Regular color={Color.DarkGrey}>{
                                props.navigation.state.params.firstname + " " + props.navigation.state.params.surname
                            }</Label>

                        </View>
                    </View>
                </View>
                <Image source={require('../../../assets/Images/anime/profile.png')}
                    style={[GlobalStyles.animImageStyle, styles.AnimImgStyle]}
                />
                <View style={styles.btnPos}>
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title="NEXT"
                        textStyle={{ padding: 0 }}
                        disabled={userPhoto.path === ''}
                        style={[styles.lastMainBtn, { backgroundColor: userPhoto.path !== '' ? Color.Yellow : Color.GreyLightColor }]}

                        onPress={() => {
                            setLoader(true);
                            accountType === "Individual" ?
                                AddProfilePicIndividual()
                                :
                                AddProfilePicBusiness();

                        }}
                    />
                </View>

            </ScrollView>
            {showLoader && <ProgressHud />}
        </SafeAreaView >
    )
}

ProfileScreen['navigationOptions'] = ({ navigation }) => ({
    headerShown: false
})

export default ProfileScreen;