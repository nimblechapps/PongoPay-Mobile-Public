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
import HeaderRight from '../../../components/Header/HeaderRight';
import ImagePicker from 'react-native-image-crop-picker';
import { fontXSmall16 } from '../../../utils/theme';
import uploadBtn from '../../../assets/Images/cloudUpload.png';
import CustomIcon from '../../../components/CustomIcon';
import AsyncStorage from '@react-native-community/async-storage';
import API from '../../../API';
import ProgressHud from '../../../components/ProgressHud';
import { setStoredData } from '../../../utils/store';


const images = {
    logoImage: require('./../../../assets/Images/logo.png')
}


const DocUploadScreen = (props, navigation) => {
    const { navigate } = navigation;
    const [userPhoto, setuserPhoto] = useState({
        image: uploadBtn,
        path: '',
        style: styles.uploadImg
    })
    const [showLoader, setLoader] = useState(false);
    const [docUploaded, setDocUploaded] = useState(false);

    const [accountType, SetAccountType] = useState("");

    useEffect(() => {
        getAccountType();
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
            cropperCircleOverlay: false,
            sortOrder: 'none',
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000,
            compressImageQuality: 1,
            mediaType: 'photo',
            includeExif: true,
        };
        if (isCamera) {
            ImagePicker.openCamera(options)
                .then(image => {
                    console.log('DOCUMENT UPLOADING', image);
                    // const source = { uri: image.path, width: image.width, height: image.height, mime: image.mime }
                    const source = { uri: image.path, mime: image.mime };
                    userPhoto.image = source;
                    userPhoto.path = image.path;
                    userPhoto.style = styles.uploadDocument;
                    console.log("CAMERA CAPTURE", userPhoto);
                    setuserPhoto(Object.assign({}, userPhoto));
                    setDocUploaded(true);
                })
                .catch(e => {
                    // Alert.alert(e.message ? e.message : e);
                    setDocUploaded(false);
                });
        } else {
            ImagePicker.openPicker(options)
                .then(image => {
                    console.log('===Document Uploading', image);
                    // const source = { uri: image.path, width: image.width, height: image.height, mime: image.mime }
                    const source = { uri: image.path, mime: image.mime };
                    console.log("== SOURCE IS ", source);

                    userPhoto.image = source;
                    userPhoto.path = image.path;
                    userPhoto.style = styles.uploadDocument;
                    console.log("==Document Data", userPhoto);
                    setuserPhoto(Object.assign({}, userPhoto));
                    setDocUploaded(true);
                })
                .catch(e => {
                    // Alert.alert(e.message ? e.message : e);
                    setDocUploaded(false);
                });
        }
    };
    const AddDocument = async () => {
        let id = await AsyncStorage.getItem('UserKey');
        console.log("The User Id is", id);

        var Document = {
            uri: userPhoto.image.uri,
            type: 'image/jpeg',
            name: 'profile.jpg'
        }

        let request = new FormData();
        request.append('userId', id);
        request.append('identity_proof', Document);


        if (accountType !== "Business") {
            request.append('isLastStep', true);
            request.append('currentStep', Routes.ShareScreen);
        } else {
            request.append('currentStep', Routes.BusinessOwner);
        }


        let response = accountType !== "Business" ? await API.editProfileIndividual(request) : await API.editProfileBusiness(request)

        setLoader(false);

        if (response.status) {
            await setStoredData(Globals.kUserData, JSON.stringify(response.data))
            if (accountType !== "Business") {
                props.navigation.navigate(Routes.ShareScreen);
            } else {
                props.navigation.navigate(Routes.BusinessOwner);
            }
        }
        else {
            alert("Please Check the Source");
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
                {/* <HeaderRight
                    buttonTitle="Skip"
                    buttonColor={Color.DarkGrey}
                    onPress={() => {
                        props.navigation.navigate(Routes.ShareScreen);
                        setLoader(false)
                    }}
                /> */}
            </View>
            <ScrollView scrollEnabled={true} enableOnAndroid={true} contentContainerStyle={styles.scrollView}>
                <View style={Globals.isIpad ? styles.logoMainViewPad : styles.logoMainView}>
                    <Image source={images.logoImage} style={styles.logoStyle} />
                </View>
                <View style={styles.mainView}>
                    <View style={styles.centerView}>
                        <Label fontSize_20 Montserrat_Light color={Color.DarkGrey}>
                            Now we need to verify that you are who you say you are
                        </Label>
                        <View style={styles.profileMainView}>
                            <TouchableOpacity style={styles.uploadBtn} onPress={() => {
                                console.log("===IMAGE UPLOADING====", docUploaded)
                                onUploadBtnClick()
                            }}>
                                <Image source={userPhoto.image}
                                    style={userPhoto.style} />
                                {!docUploaded &&
                                    <Label fontSize_14 Montserrat_Light color={Color.DarkGrey} style={{ textAlign: 'center' }}>
                                        (To create an account, you’ll need either a valid UK drivers licence or passport)
                            </Label>}
                            </TouchableOpacity>
                            {docUploaded &&
                                <TouchableOpacity
                                    onPress={() => {
                                        setuserPhoto({
                                            image: uploadBtn,
                                            path: '',
                                            style: styles.uploadImg
                                        })
                                        setDocUploaded(false)
                                        console.log("==Deleting The Image THE IMAGE", setuserPhoto);
                                    }}
                                    style={styles.deleteBtn}>
                                    <Image source={require('../../../assets/Images/trash.png')}
                                        style={{ height: 15, width: 15 }}
                                    />
                                </TouchableOpacity>}
                        </View>
                    </View>
                </View>
                <Image source={require('../../../assets/Images/anime/document.png')}
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
                            AddDocument();
                            setLoader(true);
                        }}
                    />
                </View>

            </ScrollView>
            {showLoader && <ProgressHud />}
        </SafeAreaView >
    )
}

DocUploadScreen['navigationOptions'] = ({ navigation }) => ({
    headerShown: false
})

export default DocUploadScreen;