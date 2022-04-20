/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { SafeAreaView, View, TouchableOpacity, FlatList, Dimensions, Image, Alert } from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color'
import HeaderRight from '../../components/Header/HeaderRight';
import HeaderTitle from '../../components/Header/HeaderTitle';

import KMButton from "../../components/KMButton";
import styles from "./styles"
import Globals, { MilestoneStatus } from '../../utils/Globals';
import GlobalStyles from '../../utils/GlobalStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { fontLarge22 } from '../../utils/theme';
import { ifIphoneX } from 'react-native-iphone-x-helper'
import { Routes } from '../../utils/Routes';
import CustomIcon from "../../components/CustomIcon";
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import API from '../../API';
import ProgressHud from '../../components/ProgressHud';



export default class WorkProgressDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: (
                <HeaderRight
                    iconName="chat"
                    iconStyle={{ fontSize: 26, color: Color.DarkGrey }}
                    onPress={navigation.getParam('onChatClick')}

                />
            ),
            headerTitle: () => <HeaderTitle title={"Work Progress Details"} />,

        }
    };

    constructor(props) {
        super(props);
        const { params = {} } = props.navigation.state;
        this.state = {
            isLoading: false,
            workProgress: params.workProgress,
            currentIndex: 0,
            jobDetails: params.jobDetails,
            userPhoto: params.workProgress.aImages,
            milestoneDetails: params.milestoneDetails,
            offset: 0,
            direction: ""


        }
        console.log("workProgress Images", params.workProgress)
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onChatClick: this.onChatClick,
        });
    }
    onChatClick = () => {
        let { jobDetails, milestoneDetails } = this.state
        this.props.navigation.navigate(Routes.Chat_View, { jobDetails: jobDetails, milestoneNumber: milestoneDetails.nMilestoneNumber })
    }

    renderPhoto({ item }) {
        console.log("Item", item)
        return (
            <View style={{
                width: Dimensions.get("window").width,
            }}>
                {/* {item.path && <TouchableOpacity onPress={() => this.removeImage(item)}>
                    <CustomIcon name={"close"} style={{ fontSize: 15, color: Color.BLACK }} />
                </TouchableOpacity>
                } */}
                <Image
                    style={{
                        width: '100%', ...ifIphoneX({
                            height: (Dimensions.get("window").height - 84 - 64) * 0.5
                        }, {
                            height: (Dimensions.get("window").height - 54 - 64) * 0.5
                        })
                    }}
                    source={item.path ? item.image : { uri: item }} />
            </View>
        );
    }
    handleScroll = (event) => {
        this.setState({ scrollPosition: event.nativeEvent.contentOffset.x });
        var currentOffset = event.nativeEvent.contentOffset.x;
        var direction = currentOffset > this.state.offset ? 'right' : 'left';
        let offset = currentOffset;
        this.setState({ offset })
        this.setState({ direction })
        console.log("Direction", direction);
    }
    addWorkProgressImages = async () => {
        try {
            this.setState({
                isLoading: true
            })
            let request = new FormData();


            request.append("workProgressId", this.state.workProgress._id);

            this.state.userPhoto.forEach(image => {
                let addImage = {}
                if (image.path) {
                    addImage.uri = image.path
                    addImage.path = image.path

                    addImage.type = "image/jpeg"
                    addImage.name = "workProgress.jpg"
                    request.append("aImages", addImage);
                }
            })


            let response = await API.updateImages(request)
            this.setState({ isLoading: false });
            let { screenProps } = this.props;
            if (!screenProps.isConnected) {
                return;
            }
            console.log("getAllMilestone response", response)
            screenProps.callback(response);
            this.props.navigation.goBack();

        } catch (error) {
            console.log("getAllMilestone error", error.message);
            this.setState({ isLoading: false });
        }
    }

    removeImage = (item) => {
        console.log(this.state.userPhoto.indexOf(item))
        let index = this.state.userPhoto.indexOf(item)
        let finalArray = this.state.userPhoto
        finalArray.splice(index, 1);
        this.setState({
            userPhoto: finalArray
        }, () => {
            console.log("Usr ", this.state.userPhoto)
        })

    }
    onUserPhotoClick = () => {
        Alert.alert(
            "Document",
            "Select Document",
            [
                {
                    text: "Take Photo",
                    onPress: () => this.openCameraPicker(true)
                },
                {
                    text: "Select From Gallery",
                    onPress: () => this.openCameraPicker(false),
                },
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
            ],
            { cancelable: false },
        );
    }

    openCameraPicker = (isCamera = false) => {
        let options = {
            width: 500,
            height: 500,
            cropping: true,
            cropperCircleOverlay: false,
            sortOrder: "none",
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000,
            compressImageQuality: 1,
            mediaType: "photo",
            includeExif: true,
            multiple: true
        }
        if (isCamera) {
            ImagePicker.openCamera(options).then(image => {
                console.log('received image', image);
                const userPhoto = this.state.userPhoto;
                // const source = { uri: image.path, width: image.width, height: image.height, mime: image.mime }
                // image.forEach(image => {
                const source = { uri: image.path, mime: image.mime }
                let photo = {
                    image: '',
                    path: ""
                }
                photo.image = source
                photo.path = image.path
                userPhoto.push(photo)
                // })

                this.setState({
                    userPhoto,
                    showImage: true
                });
            }).catch(e => {
                console.log(e);
                Alert.alert(e.message ? e.message : e);
            });
        } else {
            ImagePicker.openPicker(options).then(image => {
                console.log('received image', image);
                const userPhoto = this.state.userPhoto;
                // const source = { uri: image.path, width: image.width, height: image.height, mime: image.mime }
                image.forEach(image => {
                    const source = { uri: image.path, mime: image.mime }
                    let photo = {
                        image: '',
                        path: ""
                    }
                    photo.image = source
                    photo.path = image.path
                    userPhoto.push(photo)
                })
                console.log("User photo", userPhoto)
                this.setState({
                    userPhoto,
                    showImage: true

                });
            }).catch(e => {
                console.log(e);
                Alert.alert(e.message ? e.message : e);
            });
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        const { workProgress, isLoading, userPhoto } = this.state
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeVStyle}>
                    <View >
                        <FlatList
                            ref={(ref) => { this.flatListRef = ref; }}
                            horizontal
                            data={userPhoto}
                            pagingEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            extraData={this.state}
                            renderItem={item => this.renderPhoto(item)}
                            onScrollEndDrag={() => {
                                if (this.state.direction == "right") {
                                    if (this.state.currentIndex === userPhoto.length - 1) {
                                        return
                                    }
                                    this.setState(prevState => {
                                        return {
                                            currentIndex: prevState.currentIndex + 1
                                        };
                                    })
                                } else {
                                    if (this.state.currentIndex === 0) {
                                        return
                                    }
                                    this.setState(prevState => {
                                        return {
                                            currentIndex: prevState.currentIndex - 1
                                        };
                                    })
                                }
                            }}
                            onScroll={this.handleScroll}

                        />
                    </View>
                    {userPhoto.length != 0 && <View style={{ alignSelf: 'center', paddingTop: 20, paddingBottom: 10, }}>
                        <View style={{ justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity activeOpacity={1} onPress={() => {

                                if (this.state.currentIndex === 0) {
                                    return
                                }
                                this.setState(prevState => {
                                    return {
                                        currentIndex: prevState.currentIndex - 1
                                    };
                                }, () => {
                                    this.flatListRef.scrollToIndex({ index: this.state.currentIndex, animated: true })
                                });
                            }}>
                                <CustomIcon name={"left-arrow"} style={{ fontSize: fontLarge22, color: Color.BLACK }} />
                            </TouchableOpacity>
                            <Label style={{ paddingLeft: 24, paddingRight: 24, }}>{this.state.currentIndex + 1}/{userPhoto.length}</Label>
                            <TouchableOpacity activeOpacity={1} onPress={() => {
                                if (this.state.currentIndex === this.state.userPhoto.length - 1) {
                                    return
                                }
                                this.setState(prevState => {
                                    return {
                                        currentIndex: prevState.currentIndex + 1
                                    };
                                }, () => {
                                    this.flatListRef.scrollToIndex({ index: this.state.currentIndex, animated: true })
                                });
                            }}>
                                <CustomIcon name={"right_arrow"} style={{ fontSize: fontLarge22, color: Color.BLACK }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    }
                    <KeyboardAwareScrollView>
                        <View style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 30 }}>
                            <Label fontSize_16 Montserrat_Bold color={Color.BLACK} mb={8}>{workProgress.sTitle}</Label>
                            <View style={{ marginBottom: 5, flexDirection: "row" }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Upload Date:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{
                                    moment(workProgress.dCreatedAt).format('DD-MM-YYYY')}</Label>
                            </View>
                            <View style={{ marginBottom: 5, flexDirection: "row" }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Upload By:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{workProgress.nType == 0 ? workProgress.sUploadedBy + " (Client)" : workProgress.sUploadedBy + " (Tradesperson)"}</Label>
                            </View>
                            <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>Work Description:</Label>
                            <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} mt={5} mb={60}>{workProgress.sDescription}</Label>
                        </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
                {Globals.isBuilder && this.state.milestoneDetails.nMilestoneStatus !== MilestoneStatus.COMPLETED &&
                    <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title={this.state.showImage ? "SUBMIT" : "UPLOAD IMAGE"}
                        textStyle={{ padding: 0 }}
                        style={[GlobalStyles.bottomButtonStyle, { borderRadius: 0, }]}
                        onPress={this.state.showImage ? this.addWorkProgressImages : this.onUserPhotoClick}
                    />
                }
                {isLoading && <ProgressHud />}
            </View>
        );
    }
}

