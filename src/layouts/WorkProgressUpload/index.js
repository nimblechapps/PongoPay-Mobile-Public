/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Dimensions,
  Image,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color';
import HeaderLeft from '../../components/Header/HeaderLeft';
import HeaderTitle from '../../components/Header/HeaderTitle';
import HeaderRight from '../../components/Header/HeaderRight';
import KMButton from '../../components/KMButton';
import TextField from '../../components/TextField';
import styles from './styles';
import GlobalStyles from '../../utils/GlobalStyles';
import Globals from '../../utils/Globals';
import {fontLarge22} from '../../utils/theme';

import {ErrorMessage} from '../../utils/message';
import ToastMessage from '../../components/toastmessage';
import {validateCharacter} from '../../utils/validation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {fontXSmall16, fontLarge24} from '../../utils/theme';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import CustomIcon from '../../components/CustomIcon';
import ImagePicker from 'react-native-image-crop-picker';
import API from '../../API';
import ProgressHud from '../../components/ProgressHud';

const images = {
  slideImg: require('../../../src/assets/Images/slide_img.png'),
};

export default class WorkProgressUpload extends Component {
  constructor(props) {
    super(props);
    const {params = {}} = props.navigation.state;

    this.state = {
      isLoading: false,
      milestoneId: params.milestoneId,
      jobId: params.jobId,

      contractTitle: {
        value: '',
        message: '',
        isValid: false,
      },
      description: {
        value: '',
        message: '',
        isValid: true,
      },
      userPhoto: [],
      showImage: false,
      currentIndex: 0,

      offset: 0,
      direction: ""
    };
  }
  static navigationOptions = ({navigation}) => {
    return {
      headerLeft: <HeaderLeft null />,
      headerTitle: () => (
        <HeaderTitle
          title={
            Globals.isBuilder ? 'Add Work Progress' : 'Add Building Issues'
          }
        />
      ),
      headerRight: (
        <HeaderRight
          buttonTitle="Cancel"
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
    };
  };
  onUserPhotoClick = () => {
    Alert.alert(
      'Document',
      'Select Document',
      [
        {
          text: 'Take Photo',
          onPress: () => this.openCameraPicker(true),
        },
        {
          text: 'Select From Gallery',
          onPress: () => this.openCameraPicker(false),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  openCameraPicker = (isCamera = false) => {
    let options = {
      width: 500,
      height: 500,
      cropping: true,
      cropperCircleOverlay: false,
      sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      mediaType: 'photo',
      includeExif: true,
      multiple: true,
    };
    if (isCamera) {
      ImagePicker.openCamera(options)
        .then(image => {
          console.log('received image', image);
          const userPhoto = this.state.userPhoto;
          // const source = { uri: image.path, width: image.width, height: image.height, mime: image.mime }
          // image.forEach(image => {
          const source = {uri: image.path, mime: image.mime};
          let photo = {
            image: '',
            path: '',
          };
          photo.image = source;
          photo.path = image.path;
          userPhoto.push(photo);
          // })

          this.setState({
            userPhoto,
            showImage: true,
          });
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      ImagePicker.openPicker(options)
        .then(image => {
          console.log('received image', image);
          const userPhoto = this.state.userPhoto;
          // const source = { uri: image.path, width: image.width, height: image.height, mime: image.mime }
          image.forEach(image => {
            const source = {uri: image.path, mime: image.mime};
            let photo = {
              image: '',
              path: '',
            };
            photo.image = source;
            photo.path = image.path;
            userPhoto.push(photo);
          });
          console.log('User photo', userPhoto);
          this.setState({
            userPhoto,
            showImage: true,
          });
        })
        .catch(e => {
          console.log(e);
          // Alert.alert(e.message ? e.message : e);
        });
    }
  };

  removeImage = item => {
    console.log(this.state.userPhoto.indexOf(item));
    let index = this.state.userPhoto.indexOf(item);
    let finalArray = this.state.userPhoto;
    finalArray.splice(index, 1);
    this.setState(
      {
        userPhoto: finalArray,
        showImage: finalArray.length == 0 ? false : this.state.showImage,
        currentIndex: finalArray.length == 0 ? 0 : (this.state.currentIndex === this.state.userPhoto.length
          ? this.state.currentIndex - 1
          : this.state.currentIndex)
      },
      () => {
        console.log('Usr ', this.state.userPhoto);
      },
    );
  };
  handleScroll = (event) => {
    this.setState({scrollPosition: event.nativeEvent.contentOffset.x});
    var currentOffset = event.nativeEvent.contentOffset.x;
    var direction = currentOffset > this.state.offset ? 'right' : 'left';
    let offset = currentOffset;
    this.setState({offset})
    this.setState({direction})
    console.log("Direction", direction);
  }
  renderPhoto({item}) {
    console.log('Item', item);
    return (
      <View
        style={{
          width: Dimensions.get('window').width,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: Color.Yellow,
            position: 'absolute',
            right: 10,
            top: 10,
            zIndex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: 30,
            height: 30,
            borderRadius: 15,
          }}
          onPress={() => this.removeImage(item)}>
          <CustomIcon
            name={'close'}
            style={{fontSize: 14, color: Color.BLACK}}
          />
        </TouchableOpacity>

        <Image
          style={{
            width: '100%',
            ...ifIphoneX(
              {
                height: (Dimensions.get('window').height - 84 - 64) * 0.5,
              },
              {
                height: (Dimensions.get('window').height - 54 - 64) * 0.5,
              },
            ),
          }}
          source={item.image}
        />
      </View>
    );
  }

  render() {
    const {navigate} = this.props.navigation;
    const {
      contractTitle,
      showImage,
      userPhoto,
      description,
      isLoading,
    } = this.state;
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeVStyle}>
          <KeyboardAwareScrollView>
            <View>
              {showImage ? (
                <View>
                  <FlatList
                    ref={ref => {
                      this.flatListRef = ref;
                    }}
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
                  <View
                    style={{
                      alignSelf: 'center',
                      paddingTop: 20,
                      paddingBottom: 10,
                    }}>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          if (this.state.currentIndex === 0) {
                            return;
                          }
                          this.setState(
                            prevState => {
                              return {
                                currentIndex: prevState.currentIndex - 1,
                              };
                            },
                            () => {
                              this.flatListRef.scrollToIndex({
                                index: this.state.currentIndex,
                                animated: true,
                              });
                            },
                          );
                        }}>
                        <CustomIcon
                          name={'left-arrow'}
                          style={{fontSize: fontLarge22, color: Color.BLACK}}
                        />
                      </TouchableOpacity>
                      <Label style={{paddingLeft: 24, paddingRight: 24}}>
                        {this.state.currentIndex + 1}/{userPhoto.length}
                      </Label>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          if (
                            this.state.currentIndex ===
                            userPhoto.length - 1
                          ) {
                            return;
                          }
                          this.setState(
                            prevState => {
                              return {
                                currentIndex: prevState.currentIndex + 1,
                              };
                            },
                            () => {
                              this.flatListRef.scrollToIndex({
                                index: this.state.currentIndex,
                                animated: true,
                              });
                            },
                          );
                        }}>
                        <CustomIcon
                          name={'right_arrow'}
                          style={{fontSize: fontLarge22, color: Color.BLACK}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={{
                    width: '100%',
                    backgroundColor: '#F9F8F5',

                    ...ifIphoneX(
                      {
                        height:
                          (Dimensions.get('window').height - 84 - 64) * 0.5,
                      },
                      {
                        height:
                          (Dimensions.get('window').height - 54 - 64) * 0.5,
                      },
                    ),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    console.log('On CLicked');
                    this.onUserPhotoClick();
                  }}>
                  <CustomIcon
                    name={'plus'}
                    style={{
                      fontSize: 30,
                      color: Color.LightBlue,
                    }}
                  />
                  <Label
                    Montserrat_Bold
                    style={{
                      alignItems: 'center',
                      marginTop: 12,
                      fontSize: 16,
                      color: Color.BLACK,
                    }}>
                    {' '}
                    TAP to Add Image
                  </Label>
                </TouchableOpacity>
              )}
              {/* <Image style={{
                                width: '100%',
                                ...ifIphoneX({
                                    height: (Dimensions.get("window").height - 84 - 64) * 0.5
                                }, {
                                    height: (Dimensions.get("window").height - 54 - 64) * 0.5
                                })
                            }} source={images.slideImg} /> */}
            </View>

            <View style={{paddingLeft: 16, paddingRight: 16, paddingTop: 30}}>
              <View>
                <TextField
                  LabelTitle="Title*"
                  placeholder="Title"
                  onChangeText={this.onContractTitleChange}
                  value={contractTitle.value}
                  autoFocus={true}>
                  {contractTitle.message !== '' && (
                    <View
                      style={
                        Globals.isIpad
                          ? GlobalStyles.errorTxtPad
                          : GlobalStyles.errorTxt
                      }>
                      <CustomIcon
                        name={'warning'}
                        style={{
                          color: Color.Red,
                          fontSize: fontXSmall16,
                          alignItems: 'center',
                        }}
                      />
                      <Label
                        fontSize_14
                        Montserrat_Regular
                        color={Color.DarkGrey}
                        style={{paddingLeft: 10}}>
                        {contractTitle.message}
                      </Label>
                    </View>
                  )}
                </TextField>
              </View>
              <View style={{zIndex: -1}}>
                <TextField
                  multiline
                  LabelTitle="Description"
                  placeholder="Write here…"
                  onChangeText={this.onDescriptionChange}
                  value={description.value}
                  customStyle={{height: 96, paddingTop: 10, paddingBottom: 10}}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
        <KMButton
          fontSize_16
          Montserrat_Medium
          color={Color.BLACK}
          title="SUBMIT"
          textStyle={{padding: 0}}
          style={[
            GlobalStyles.bottomButtonStyle,
            {
              backgroundColor: this.isSubmitDisable()
                ? Color.GreyLightColor
                : Color.Yellow,
            },
          ]}
          onPress={() => {
            console.log('isShowToast');
            this.addWorkProgress();
            // this.setState({ isShowToast: true })
          }}
          disabled={this.isSubmitDisable()}
        />
        {/* <ToastMessage
                    successIconCustom={{ fontSize: fontLarge24 }}
                    massageTextCustom={{ fontSize: fontXSmall16, lineHeight: 24, width: '90%' }}
                    message="Work Progress added successfully"
                    mainViewCustom={{ alignItems: 'center' }}
                    isVisible={this.state.isShowToast} /> */}
        {isLoading && <ProgressHud />}
      </View>
    );
  }

  addWorkProgress = async () => {
    // const { screenProps } = this.props;
    // if (!screenProps.isConnected) {
    //     return
    // }

    this.setState({isLoading: true});
    try {
      let aImages = [];

      console.log('AIMAGES', JSON.stringify(aImages));
      // if (this.state.userPhoto.path) {
      //     aImages.uri = this.state.userPhoto.path
      //     aImages.type = "image/jpeg"
      //     aImages.name = "workProgress.jpg"
      // }

      let request = new FormData();

      request.append('milestoneId', this.state.milestoneId);
      request.append('jobId', this.state.jobId);
      request.append('sTitle', this.state.contractTitle.value);
      request.append('sDescription', this.state.description.value);
      this.state.userPhoto.forEach(image => {
        let addImage = {};
        if (image.path) {
          addImage.uri = image.path;
          addImage.path = image.path;

          addImage.type = 'image/jpeg';
          addImage.name = 'workProgress.jpg';
          request.append('aImages', addImage);
        }
      });
      // if (Object.keys(aImages).length != 0) {
      // }

      let response = await API.addWorkProgress(request);
      this.setState({isLoading: false});
      console.log('getAllMilestone response', response.data);
      if (response.status) {
        let {screenProps} = this.props;
        if (!screenProps.isConnected) {
          return;
        }
        screenProps.callback(response);
        this.props.navigation.goBack();
      }
    } catch (error) {
      console.log('getAllMilestone error', error.message);
      this.setState({isLoading: false});
    }
  };
  onContractTitleChange = text => {
    const contractTitle = this.state.contractTitle;
    contractTitle.value = text;

    if (contractTitle.value.length == 0 || contractTitle.value == '') {
      contractTitle.message = ErrorMessage.workProgressTitleRequired;
      contractTitle.isValid = false;
    }
    // else if (!validateCharacter(contractTitle.value)) {
    //   contractTitle.message = ErrorMessage.firstNameInvalid;
    //   contractTitle.isValid = false;
    // } 
    else {
      contractTitle.message = '';
      contractTitle.isValid = true;
    }
    this.setState({
      contractTitle,
    });
  };
  onDescriptionChange = text => {
    const description = this.state.description;
    description.value = text;
    this.setState({
      description,
    });
  };
  isSubmitDisable() {
    return (
      !this.state.contractTitle.isValid || this.state.userPhoto.path === ''
    );
  }
}
