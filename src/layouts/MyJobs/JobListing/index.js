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
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Modal,
  Linking,
  Image,
  Dimensions,
  AppState
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import CheckBox from 'react-native-check-box';

import Color from '../../../utils/color';
import styles from './styles';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import HeaderTitle from '../../../components/Header/HeaderTitle';
import HeaderRight from '../../../components/Header/HeaderRight';
import KMButton from '../../../components/KMButton';
import SearchBar from '../../../components/searchbar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import API from '../../../API';
import ProgressHud from '../../../components/ProgressHud';
import Label from '../../../components/Label';
import FilterDropdown from '../../../components/FilterDropdown';
import Globals, {
  isValidIntValue,
  MilestoneStatus,
  JobStatus,
  timer,
  contains,
  PAYMENT_TYPE,
  constant,
  nextPayoutDateTime,
  dateDiff
} from '../../../utils/Globals';
import GlobalStyles from '../../../utils/GlobalStyles';
import {fontSmall14, fontXSmall16, fontLarge24} from '../../../utils/theme';
import {Routes} from '../../../utils/Routes';
import CustomIcon from "../../../components/CustomIcon";
import {getUserName} from "../../../utils/getUserName";
import {getJobStatus, getMilestoneStatus, getJobAmount} from "../../../utils/GetUserStatus";
import PaymentView from '../../../components/PaymentView';
import YoutubePlayer from "react-native-youtube-iframe";


// import SwipeUpDown from "../../../components/Swipe/Swipe";

const beforeAccept = ['Accept Job', 'Reject Job'];
const afterAccept = ['Create Contract', 'Cancel Job'];
import {getStoredData, setStoredData} from '../../../utils/store';
import Mangopay from '../../../utils/mangopay';
import {constants} from 'buffer';
import {width} from '../../../utils/dimensions';

const PaymentStatus = {
  processing: 0,
  success: 1,
  failed: 2,
};

const showReviewRequest = [
  MilestoneStatus.ON_GOING,
  MilestoneStatus.WORK_REVIEW_REQUEST,
];

const images = {
  builderJob: require('./../../../../src/assets/Images/anime/img_complete_first_job.png'),
  clientJob: require('./../../../../src/assets/Images/anime/img_complete_first_job_client.png')
}


var subscription = undefined;


export default class JObListing extends Component {
  // static navigationOptions = ({ navigation }) => {
  //   console.log('Show ', Globals.isClient);
  //   return {
  //     headerLeft: (
  //       <HeaderLeft
  //         iconName="burger_menu"
  //         onPress={() => {
  //           navigation.toggleDrawer();
  //         }}
  //       />
  //     ),
  //     headerTitle: () => <HeaderTitle title={'Manage Jobs'} />,
  //     headerRight: Globals.isClient ? (
  //       <HeaderRight
  //         buttonTitle="Job Code"
  //         onPress={() => {
  //           // this.setState({ isShowToast: true })
  //           navigation.navigate(Routes.Add_Job_Code);
  //         }}
  //       />
  //     ) : (
  //         <HeaderRight
  //           iconName="mobile_filter"
  //           onPress={navigation.getParam('onFilterClickHeader')}
  //         />
  //       ),
  //   };
  // };

  static navigationOptions = ({navigation}) => {
    console.log('Show ', Globals.isClient);
    let isJobsData = navigation.getParam('isJobsData')
    console.log('isJobsData == ', isJobsData);

    return {
      headerLeft: (
        <HeaderLeft
          iconName="burger_menu"
          onPress={() => {
            navigation.toggleDrawer();
          }}
        />
      ),
      headerTitle: () => <HeaderTitle title={'Manage Jobs'} />,
      headerRight: () =>
        <HeaderRight
          iconName="mobile_filter"
          onPress={navigation.getParam('onFilterClickHeader')}
        />

      // headerRight: () =>
      //   isJobsData ? <HeaderRight
      //     iconName="mobile_filter"
      //     onPress={navigation.getParam('onFilterClickHeader')}
      //   /> : null
    }
  }



  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isShowFilter: false,
      isAccept: false,
      userId: '',
      user: undefined,
      pageNo: 0,
      isLoadingMore: false,
      count: 0,
      jobsData: [],
      searchText: '',
      status: [],
      showSeeMoreModal: false,
      jobId: undefined, // for client
      jobStatus: undefined, // for client
      acceptMilestonesStatus: undefined, // for client,
      jobStatusArr: [],
      selectedStatus: [],
      paymentProceesing: false,
      paymentStatus: PaymentStatus.processing,
      showYoutubeModal: false,
      playing: true,
      // 
      refreshing: false,
      appState: AppState.currentState
      // 
    };
  }


  getInitials() {
    this.setState({
      isLoading: false,
      paymentProceesing: false,
      paymentStatus: PaymentStatus.processing,
    });
  }


  _handleAppStateChange = (nextAppState) => {

    this.setState({appState: nextAppState});

    if (nextAppState === 'background') {
      // Do something here on app background.
      console.log("App is in Background Mode.")
    }

    if (nextAppState === 'active') {
      // Do something here on app active foreground mode.
      console.log("App is in Active Foreground Mode.")
      this.getAllJobsDetails(() => {
        this.setState({isLoading: false});
      }, true);
    }

    if (nextAppState === 'inactive') {
      // Do something here on app inactive mode.
      console.log("App is in inactive Mode.")
    }
  };



  componentDidMount() {

    let {jobStatusArr} = this.state;
    for (const key in JobStatus) {
      if (JobStatus.hasOwnProperty(key)) {
        jobStatusArr.push({
          title: getJobStatus(JobStatus[key])[0],
          status: JobStatus[key],
        });
      }
    }
    this.setState({jobStatusArr});
    this.props.navigation.setParams({
      onFilterClickHeader: this.onFilterClickHeader,
    });
    this.getUserProfile();
  }

  getUserProfile = async () => {
    try {
      let response = await API.getUserProfile();
      console.log('get user profile response', response);
      if (response.status) {
        await setStoredData(Globals.kUserData, JSON.stringify(response.data));
        this.props?.screenProps?.onRefreshUser()
      }
    } catch (error) {}
  }

  setshowSeeMoreModal(visible) {
    this.setState({showSeeMoreModal: visible});
  }

  setShowYoutubeModal(visible) {
    this.setState({showYoutubeModal: visible});
  }

  onFilterClickHeader = () => {
    this.setState({isShowFilter: true});
  }

  onCreate = () => {
    this.props.navigation.setParams({
      onFilterClick: this.onFilterClick,
    });
    getStoredData(Globals.kUserData).then(value => {
      let result = JSON.parse(value);
      console.log('jobListing UserData', result);
      this.setState({
        user: result,
      })
    })
    console.log('Channels', global.channels);
    this.getAllJobsDetails();
  }

  async onFinalApproveMilestone(milestone, paymentType, cardId) {
    console.log('MILESTNE', milestone);
    this.setState({isLoading: true});
    try {
      let request = {
        milestoneId: milestone._id,
        milestoneNumber: milestone.nMilestoneNumber,
        jobId: milestone.oJobId,
      };
      console.log('param', request);
      if (paymentType) {
        request['paymentType'] = paymentType
        if (paymentType === PAYMENT_TYPE.CARD) {
          request['cardId'] = cardId
        }
      }

      let response = await API.milestoneCompleted(request);
      this.setState({isLoading: false});
      console.log('milestoneCompleted response', response);
      if (paymentType || milestone.isLastMilestone) {
        setTimeout(() => {
          this.setState({
            isLoading: false,
            failedMessage: response.msg,
            paymentStatus: response.status
              ? PaymentStatus.success
              : PaymentStatus.failed,
          });
          setTimeout(() => {
            this.getInitials();
          }, 2000);
        }, 2000);
      }

      if (response.status) {
        this.getAllJobsDetails();
      }
    } catch (error) {
      console.log('milestoneCompleted error', error.message);
      this.setState({isLoading: false});
    }
  }

  onApproveMilestone = async (milestone) => {
    let jobsData = this.state.jobsData[0]
    let isLastMilestone = milestone.isLastMilestone
    // let isLastMilestone = jobsData.AllMilestones.length === milestone.nMilestoneNumber
    if (isLastMilestone) {
      this.setState({paymentProceesing: true, milestonTitle: jobsData.AllMilestones[milestone.nMilestoneNumber].sMilestoneTitle, escrow: false});

      this.onFinalApproveMilestone(milestone)
    } else {
      this.props.navigation.push(Routes.CardView, {
        onGoBack: async (paymentType, paymentDetails) => {
          this.setState({paymentProceesing: true, milestonTitle: jobsData.AllMilestones[milestone.nMilestoneNumber].sMilestoneTitle});

          let response = {status: true}
          if (paymentType === PAYMENT_TYPE.CARD) {
            paymentDetails.cardId ? (response['cardId'] = paymentDetails.cardId) : (response = await Mangopay.registerCard(paymentDetails))
          } else if (paymentType === PAYMENT_TYPE.BANK) {
            response['mandateId'] = undefined //paymentDetails.mandateId)
          }

          if (response.status) {
            setTimeout(() => {
              //response.cardId
              this.setState({milestonTitle: jobsData.ActiveMilestones.title})
              this.onFinalApproveMilestone(milestone, paymentType, paymentType === PAYMENT_TYPE.CARD ? response.cardId : response.mandateId)
            }, 2000);
          } else {
            setTimeout(() => {
              this.setState({isLoading: false, failedMessage: response.msg, paymentStatus: response.status ? PaymentStatus.success : PaymentStatus.failed});
              setTimeout(() => {
                this.getInitials()
              }, 2000);
            }, 1000)
          }
        }

        // (cardDetails) => {
        //     setTimeout(() => {
        //         this.setState({ milestonTitle: jobsData.ActiveMilestones.title })
        //         this.onFinalApproveMilestone(milestone, cardDetails)
        //     }, 2000);
        // }
      })
    }
  }

  hideFilter = () => {
    this.setState({isShowFilter: false});
  };

  applyFilter = selectedStatus => {
    this.setState(
      {
        selectedStatus,
        isShowFilter: false,
      },
      this.getAllJobsDetails,
    );
  };

  onAddJobAmount = (jobDetails) => {
    const {navigation} = this.props;
    navigation.navigate(Routes.Create_New_Job, {
      jobDetails: jobDetails,
      isEdit: true
    })
  }

  youtubeModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showYoutubeModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.youtubeView}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              this.setState({
                playing: false
              }, () => {
                this.setShowYoutubeModal(false);
              })
            }}>
            <CustomIcon
              name={'close'}
              style={{fontSize: fontLarge24, color: Color.DarkGrey}}
            />
          </TouchableOpacity>
          <YoutubePlayer
            height={300}
            play={this.state.playing}
            videoId={"GLZdzRFj3hI"}
          // onChangeState={onStateChange}
          />
        </View>
      </Modal>
    )
  }

  render() {
    const {navigate} = this.props.navigation;
    const {
      milestonTitle,
      paymentProceesing,
      paymentStatus,
      failedMessage,
      isLoading,
      isLoadingMore,
      searchText,
      jobsData,
      isShowFilter,
      jobId,
      acceptMilestonesStatus,
      jobStatus,
      jobTitle,
      // 
      refreshing,
      // 
    } = this.state;
    console.log('Status===>', acceptMilestonesStatus);

    return (
      <View style={styles.container}>
        <PaymentView
          paymentProceesing={paymentProceesing}
          paymentStatus={paymentStatus}
          failedMessage={failedMessage}
          jobTitle={milestonTitle}
          escrow={this.state.escrow}
        />
        <FilterDropdown
          valuesArray={this.state.jobStatusArr}
          visible={isShowFilter}
          onStatusChanged={this.onStatusChanged}
          onClosePress={this.hideFilter}
          onApplyPress={this.applyFilter}
        />

        <View style={styles.searchBox}>
          <View style={styles.innerSearch}>
            <SearchBar
              boxStyleCustom={{height: 40, fontSize: fontSmall14}}
              placeholder="Search by Job, Client, Property Manager…"
              value={searchText}
              onChangeText={this.onSearchTextChange}
            />
          </View>
          {/* BG */}
          {/* {Globals.isClient && (
            <HeaderRight
              iconName="mobile_filter"
              iconStyle={{
                color: Color.LightBlue,
                position: 'relative',
                right: 0,
              }}
              onPress={this.props.navigation.getParam('onFilterClickHeader')}
            />
          )} */}
          {/* BG */}
        </View>
        <SafeAreaView
          style={[
            styles.safeVStyle,
            this.state.jobsData.length == 0 && {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          {this.state.jobsData.length == 0 ? (
            <View style={{flex: 1, justifyContent: "center"}}>
              <Image resizeMode='contain' source={Globals.isBuilder ? images.builderJob : images.clientJob} />
              {!Globals.isClient && <KMButton
                onPress={() => this.setShowYoutubeModal(true)}
                fontSize_16 Montserrat_Medium
                color={Color.WHITE} title="View Video"
                style={{width: '50%', backgroundColor: Color.LightBlue, paddingHorizontal: 20, alignSelf: 'center', paddingVertical: 10, marginTop: 30}}
                // 
                textStyle={{color: Color.WHITE}}
              // 
              />}
              {!Globals.isClient && <Label align='center' ml={40} mr={20} mt={20} color={Color.DarkGrey}>
                Test it out! Use Pongo and we’ll deposit an extra £30 straight to your account as soon as you complete your first job.
              </Label>}

            </View>
          ) : (
            <FlatList
              data={jobsData}
              extraData={this.state}
              renderItem={({item}) => this.renderListing(item)}
              keyExtractor={item => item._id}
              onEndReached={this.fetchMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isLoadingMore ? (
                  <View style={{flex: 1, paddingVertical: 15}}>
                    <ActivityIndicator />
                  </View>
                ) : null
              }
              // 
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            //
            />
          )}
        </SafeAreaView>

        {Globals.isBuilder && (
          <View style={{flexDirection: 'row'}}>
            <KMButton
              fontSize_16
              Montserrat_Medium
              color={Color.BLACK}
              title={this.state.jobsData.length === 0 ? "Create First Job" : "Create New Job Quote"}
              textStyle={{padding: 0}}
              style={[
                GlobalStyles.bottomButtonStyle,
                {
                  borderRadius: 0,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
              onPress={() => navigate(Routes.Create_New_Job, {
                title: this.state.jobsData.length === 0 ? "Create First Job" : "Create New Job Quote"
              })}
            />
            {/* <View style={{ width: 1, height: 64 }} /> */}
            {/* <KMButton
              fontSize_16
              Montserrat_Medium
              color={Color.BLACK}
              title="JOB CODE"
              textStyle={{ padding: 0 }}
              style={[
                GlobalStyles.bottomButtonStyle,
                {
                  borderRadius: 0,
                  width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
              onPress={() => {
                this.setState({ isShowToast: true });
                navigate(Routes.Add_Job_Code);
              }}
            /> */}
          </View>
        )}
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.showSeeMoreModal}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={styles.seeAllBox}>
              <TouchableOpacity
                style={styles.arrowDownBtn}
                onPress={() => {
                  this.setshowSeeMoreModal(!this.state.showSeeMoreModal);
                }}>
                <CustomIcon
                  name={'arrowdown'}
                  style={{fontSize: fontLarge24, color: Color.DarkGrey}}
                />
              </TouchableOpacity>
              <KeyboardAwareScrollView>
                <View
                  style={{
                    paddingLeft: 16,
                    paddingRight: 16,
                  }}>
                  <CheckBox
                    style={{marginBottom: 20}}
                    onClick={() => {
                      this.setState({
                        isContractTerms: !this.state.isContractTerms,
                      });
                    }}
                    isChecked={this.state.isContractTerms}
                    checkedImage={
                      <CustomIcon
                        name="checked-box"
                        style={styles.checkIcon}
                      />
                    }
                    unCheckedImage={
                      <CustomIcon
                        name="unchecked-box"
                        style={styles.checkIcon}
                      />
                    }
                    rightTextView={
                      <View
                        style={{
                          paddingLeft: 25,
                        }}>
                        <Label color={Color.BLACK}>
                          I have read and agree to the PongoPay
                        </Label>
                        {/* <TouchableOpacity onPress={() => Linking.openURL(Globals.termsServiceUrl)} >
                                                                <Label color={Color.LightBlue}>terms and conditions</Label>
                                                            </TouchableOpacity>
                                                            <Label color={Color.BLACK}> and privacy policy</Label> */}
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              Linking.openURL(Globals.termsServiceUrl)
                            }>
                            <Label color={Color.LightBlue}>
                              terms and conditions{' '}
                            </Label>
                          </TouchableOpacity>
                          <Label color={Color.BLACK}>
                            and{' '}
                          </Label>
                          <TouchableOpacity
                            onPress={() =>
                              Linking.openURL(Globals.privacyPolicyUrl)
                            }>
                            <Label color={Color.LightBlue}>
                              privacy policy
                            </Label>
                          </TouchableOpacity>
                        </View>
                      </View>
                    }
                  />
                  <TouchableOpacity
                    style={[
                      styles.approveContractBtn,
                      {
                        backgroundColor: this.state.isContractTerms
                          ? Color.Yellow
                          : Color.LightGrey,
                      },
                    ]}
                    onPress={() => {
                      if (this.state.isContractTerms) {
                        this.setModalVisible(!this.state.modalVisible);
                        this.onAcceptMilestones();
                      }
                    }}>
                    <Label
                      fontSize_16
                      color={Color.BLACK}
                      Montserrat_Medium>
                      Accept and Proceed to Payment
                    </Label>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </Modal>
        </View>
        {/* {acceptMilestonesStatus == 0 &&
          !Globals.isBuilder &&
          jobsData.length == 1 && (
            <KMButton
              fontSize_16
              Montserrat_Medium
              color={Color.DarkGrey}
              title="Accept Proposal"
              textStyle={{ padding: 0 }}
              style={[
                GlobalStyles.bottomButtonStyle,
                {
                  borderRadius: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'flex-end',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: -1 },
                  shadowOpacity: 0.09,
                  shadowRadius: 5,
                  elevation: 5,
                  backgroundColor: Color.WHITE,
                },
              ]}
              onPress={() => this.setshowSeeMoreModal(true)}>
              <CustomIcon
                name={'arrowup'}
                style={{ fontSize: fontLarge24, color: Color.DarkGrey }}
              />
            </KMButton>
          )} */}

        {this.youtubeModal()}

        {isLoading && <ProgressHud />}
        <NavigationEvents
          onWillBlur={() => {
            console.log("==== onWillBlur ====");
          }}
          onDidBlur={() => {
            AppState.removeEventListener('change', this._handleAppStateChange);
          }}

          onWillFocus={() => {
            AppState.addEventListener('change', this._handleAppStateChange);
            this.onCreate()
          }} />
      </View>
    );
  }

  renderListing = item => {
    const {isAccept, milestones, count} = this.state;
    // console.log(
    //   'Job status',
    //   item.oCreatedBy == this.state.user._id &&
    //   (item.nStatus == 0 ||
    //     item.nStatus == 1 ||
    //     item.nStatus == 2 ||
    //     item.nStatus == 3),
    // );

    if (
      item.oCreatedBy == this.state.user._id &&
      (item.nStatus == 0 ||
        item.nStatus == 1 ||
        item.nStatus == 2 ||
        item.nStatus == 3)
    ) {
      item['isEditJob'] = true;
    } else {
      item['isEditJob'] = false;
    }

    let showDetail = !Globals.isBuilder && count == 1;
    return (
      <View>
        <View style={Globals.isIpad ? styles.boxPaddingPad : styles.boxPadding}>
          {this.renderJobList(showDetail, item)}
          {Globals.isBuilder && this.checkAcceptStatus(item) && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <KMButton
                title={'Accept Job'}
                onPress={() => this.onAcceptRejectByBuilder(item._id, 1)}
                style={styles.button}
                textStyle={{
                  color: Color.WHITE,
                  fontSize: fontXSmall16,
                  fontFamily: 'Montserrat-Medium',
                }}
              />
              <KMButton
                title={'Reject Job'}
                onPress={() => this.onAcceptRejectByBuilder(item._id, 2)}
                textStyle={{
                  color: Color.LightBlue,
                  fontSize: fontXSmall16,
                  fontFamily: 'Montserrat-Medium',
                }}
                style={[
                  styles.button,
                  {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: Color.LightBlue,
                  },
                ]}
              />
            </View>
          )}
          {/* {item.nAcceptClientStatus == 0 && showDetail && (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(
                  Routes.Milestone_Modification_Requests,
                  {
                    jobId: item._id,
                    acceptMilestonesStatus: item.acceptMilestonesStatus,
                  },
                );
              }}
              style={{ marginTop: 10, marginBottom: 10 }}>
              <Label fontSize_16 color={Color.LightBlue} Montserrat_Medium>
                View Modification Request
              </Label>
            </TouchableOpacity>
          )} */}

          {!Globals.isBuilder && (
            <KMButton
              title={item.nAcceptClientStatus == 1 ? 'View job' : 'View Proposal'}
              onPress={() => this.oepnJobDetailScreen(item)}
              style={[
                styles.button,
                {width: '100%', backgroundColor: Color.Yellow},
              ]}
              textStyle={{
                fontSize: fontXSmall16,
                fontFamily: 'Montserrat-Medium',
              }}
            />
          )}
          {(Globals.isBuilder && item.nStatus === JobStatus.INCOMPLETE_JOB) && (
            <KMButton
              title="Add Job Amount"
              onPress={() => this.onAddJobAmount(item)}
              style={[
                styles.button,
                {width: '100%', },
              ]}
              textStyle={{
                color: Color.WHITE,
                fontSize: fontXSmall16,
                fontFamily: 'Montserrat-Medium',
              }}
            />
          )}
        </View>
        {/* {showDetail && (
          <View>
            <View style={{ paddingRight: 16, paddingLeft: 16, paddingTop: 16 }}>
              <Label fontSize_14 Montserrat_Bold mb={18}>
                Payment Stages Breakdown
              </Label>
            </View>
            <FlatList
              data={item.AllMilestones}
              renderItem={milestone => this.renderMilestone(milestone, item)}
            />
          </View>
        )} */}
      </View>
    );
  };

  renderJobList(showDetail, item) {
    let paymentDueTime = undefined;
    // if (Globals.isClient) {
    item.AllMilestones.forEach(m => {
      if (
        parseInt(m.nMilestoneStatus) === MilestoneStatus.WORK_REVIEW_REQUEST
      ) {
        // paymentDueTime = `${timer(m.dReviewRequestAt, 30)} to respond`;
        let payoutDate = nextPayoutDateTime(m.dReviewRequestAt);
        paymentDueTime = `${dateDiff(payoutDate)} to respond`;

      }
    });
    // }

    let pedningJobArr = [
      JobStatus.PENDING,
      JobStatus.REQUESTED,
      JobStatus.AWAITING_RESPONSE,
    ];
    let isPending = contains(pedningJobArr, item.nStatus);

    return (
      <TouchableOpacity
        // disabled={showDetail}
        onPress={() => this.oepnJobDetailScreen(item)}>
        <View style={Globals.isIpad ? styles.titleBtnPad : styles.titleBtn}>
          <Label
            fontSize_16
            Montserrat_Bold
            color={Color.BLACK}
            style={{lineHeight: 20}}>
            {item.sJobTitle}
          </Label>
          {/* {!showDetail && ( */}
          <CustomIcon
            name="right_arrow"
            color={Color.DarkGrey}
            style={{fontSize: fontXSmall16}}
          />
          {/* )} */}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View
            style={{
              backgroundColor: getJobStatus(item.nStatus)[1],
              marginRight: 10,
              paddingLeft: 10,
              paddingTop: 3,
              paddingBottom: 3,
              paddingRight: 10,
              borderRadius: 50,
            }}>
            <Label fontSize_12 Montserrat_Medium color={Color.WHITE}>
              {getJobStatus(item.nStatus)[0]}
            </Label>
          </View>
          {getJobStatus(item.nStatus)[2] !== '' && item.nStatus === JobStatus.COMPLETED &&
            <View
              style={{
                width: 18,
                height: 18,
                backgroundColor: (item.nStatus)[1],
                borderRadius: 9,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <CustomIcon
                name="check"
                style={{color: Color.WHITE, fontSize: 9}}
              />
            </View>}
        </View>

        {/* <View
          style={{
            flexDirection: 'row',
            paddingBottom: 6,
            flex: 1,
            flexWrap: 'wrap',
          }}>
          <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey}>
            Total Job Amount:
          </Label>
          {isValidIntValue(item.nJobAmount) ? (
            <Label
              fontSize_14
              Montserrat_Medium
              color={Color.BLACK}
              ml={5}
              style={{ lineHeight: 20 }}>
              {'£ ' + item.nJobAmount}
            </Label>
          ) : (
            <Label
              fontSize_14
              Montserrat_Medium
              color={Color.BLACK}
              ml={5}
              style={{ lineHeight: 20 }}>
              -
            </Label>
          )}
        </View> */}

        {Globals.isBuilder && !item.registeredClient && (
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: 6,
              flex: 1,
              flexWrap: 'wrap',
            }}>
            <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey}>
              {Globals.isBuilder ? 'Client:' : 'Tradeperson:'}{' '}
            </Label>
            <Label Montserrat_Medium fontSize_14 color={Color.BLACK} ml={4}>
              {Globals.isBuilder
                ? getUserName(item.Client)
                : getUserName(item.Builder)}{' '}
            </Label>
          </View>
        )}

        {item.PropertyManager._id && (
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: 6,
              flex: 1,
              flexWrap: 'wrap',
            }}>
            <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey}>
              Property Manager:
            </Label>
            <Label Montserrat_Medium fontSize_14 color={Color.BLACK} ml={4}>
              {getUserName(item.PropertyManager)}
            </Label>
          </View>
        )}
        {/* {!isPending &&
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: 6,
              flex: 1,
              flexWrap: 'wrap',
            }}>
            <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey}>
              Payment Stage Active:
              </Label>
            <Label Montserrat_Medium fontSize_14 color={Color.BLACK} ml={4}>
              {item.ActiveMilestones.title
                ? item.ActiveMilestones.title
                : '-'}
            </Label>
          </View>
        } */}

        {/* {!isPending &&
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: 6,
              flex: 1,
              flexWrap: 'wrap',
            }}>
            <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey}>
              Payment Stage Status:{' '}
            </Label>
            <Label Montserrat_Medium fontSize_14 color={Color.LightBlue}>
              {
                getMilestoneStatus(item.ActiveMilestones.status)
                  .milestoneStatus
              }
            </Label>
          </View>
        } */}

        {paymentDueTime && (
          <View style={{flexDirection: 'row', paddingBottom: 6}}>
            <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey}>
              Payment Requested:{' '}
            </Label>
            <Label Montserrat_Medium fontSize_14 color={Color.BLACK} ml={4}>
              {paymentDueTime}
            </Label>
          </View>
        )}
        {/* {showDetail && (
          <Label
            style={{ paddingTop: 5 }}
            Montserrat_Medium
            fontSize_14
            color={Color.DarkGrey}>
            Job Description:{' '}
          </Label>
        )}
        {showDetail && (
          <Label
            style={{ paddingBottom: 5 }}
            Montserrat_Medium
            fontSize_14
            color={Color.BLACK}
            ml={4}>
            {item.sJobDescription}
          </Label>
        )} */}
      </TouchableOpacity>
    );
  }

  renderMilestone(data, jobData) {
    const {navigate} = this.props.navigation;
    let m = data.item;
    console.log('DATA', data.item);
    return (
      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        <TouchableOpacity
          style={styles.SwipeListView}
          onPress={() => {
            navigate(Routes.Milestone_Detail, {
              milestoneDetails: m,
              jobDetails: jobData,
            });
          }}>
          <View>
            <Label
              Montserrat_Medium
              fontSize_16
              color={Color.BLACK}
              mb={10}>{`Payment Stage ${m.nMilestoneNumber}`}</Label>
            <View
              style={{
                flexDirection: 'row',
                paddingBottom: 6,
                flex: 1,
                flexWrap: 'wrap',
              }}>
              <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey}>
                Payment Stage Title:
              </Label>
              <Label Montserrat_Medium fontSize_14 color={Color.BLACK} ml={4}>
                {m.sMilestoneTitle}
              </Label>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingBottom: 6,
                flex: 1,
                flexWrap: 'wrap',
              }}>
              <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey}>
                Payment Stage Status:
              </Label>
              {/* <Label Montserrat_Medium fontSize_14 color={Color.LightBlue} ml={4}>{getMilestoneStatus(m.nMilestoneStatus).milestoneStatus}</Label> */}
              {/* Rucha ggg*/}

              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 5,
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    backgroundColor: getMilestoneStatus(m.nMilestoneStatus)
                      .milestoneColor,
                    marginRight: 10,
                    paddingTop: 3,
                    paddingBottom: 3,
                    paddingRight: 10,
                    borderRadius: 50,
                  }}>
                  <Label
                    fontSize_12
                    Montserrat_Medium
                    color={getMilestoneStatus(m.nMilestoneStatus).TextColor}>
                    {getMilestoneStatus(m.nMilestoneStatus).milestoneStatus}
                  </Label>
                </View>
                {m.nMilestoneStatus === MilestoneStatus.COMPLETED && <View
                  style={{
                    width: 18,
                    height: 18,
                    backgroundColor: Color.LightBlue,
                    borderRadius: 9,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      width: 18,
                      height: 18,
                      backgroundColor: getMilestoneStatus(m.nMilestoneStatus)
                        .milestoneColor,
                      borderRadius: 9,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <CustomIcon
                      name={
                        getMilestoneStatus(m.nMilestoneStatus).milestoneImage
                      }
                      style={{color: Color.WHITE, fontSize: 9}}
                    />
                  </View>

                </View>}
              </View>
              {/* Rucha */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingBottom: 6,
                flex: 1,
                flexWrap: 'wrap',
              }}>
              <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey}>
                Payment Stage Amount:
              </Label>
              <Label Montserrat_Medium fontSize_14 color={Color.BLACK} ml={4}>
                £ {m.nMilestoneAmount}
              </Label>
            </View>
            {!Globals.isBuilder &&
              m.nMilestoneStatus === MilestoneStatus.WORK_REVIEW_REQUEST && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <KMButton
                    title={'Release Payment'}
                    onPress={() => this.onApproveMilestone(m)}
                    style={[
                      styles.button,
                      {
                        width: '100%',
                        backgroundColor: Color.LightBlue,
                        color: Color.WHITE,
                      },
                    ]}
                    textStyle={{
                      color: Color.WHITE,
                      fontSize: fontXSmall16,
                      fontFamily: 'Montserrat-Medium',
                    }}
                  />
                </View>
              )}
          </View>
          <View style={{marginRight: 0}}>
            <CustomIcon
              name={'right_arrow'}
              style={{fontSize: fontXSmall16, color: Color.DarkGrey}}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  onSearchTextChange = text => {
    this.setState({
      searchText: text,
    });
    if (text.length == 0) {
      this.setState(
        {
          pageNo: 0,
        },
        () => {
          this.getAllJobsDetails(() => {}, false);
        },
      );
    }
    if (text.length > 3) {
      this.setState(
        {
          pageNo: 0,
        },
        () => {
          this.getAllJobsDetails(() => {}, false);
        },
      );
    }
  };

  checkAcceptStatus(item) {
    return this.state.user._UserRoleId == 'UR004'
      ?
      item.nAcceptBuilderStatus == 0 &&
      item.oCreatedBy != this.state.user.userId
      :
      item.nAcceptClientStatus == 0 &&
      item.oCreatedBy != this.state.user.userId;
  }

  oepnJobDetailScreen = item => {
    const {navigate} = this.props.navigation;
    console.log('jobCount', this.state.count);
    navigate(Routes.Job_Details, {
      jobDetails: item,
      jobId: item._id,
      jobCount: this.state.count,
      isJobAccepted: item.nStatus != JobStatus.AWAITING_RESPONSE,
      acceptMilestonesStatus: this.state.acceptMilestonesStatus,
      onGoBack: () => {
        this.setState({
          pageNo: 0
        })
      }
    });
  };

  fetchMore = async () => {
    const {pageNo, count} = this.state;
    if ((pageNo + 1) * 10 < count) {
      this.setState(
        {
          pageNo: this.state.pageNo + 1,
          isLoadingMore: true,
        },
        () => {
          this.getAllJobsDetails(() => {
            this.setState({isLoadingMore: false});
          }, false);
        },
      );
    }
  };

  // BG
  onRefresh = () => {
    this.setState({
      refreshing: true,
      pageNo: 0
    }, () => {
      this.getAllJobsDetails(() => {
        this.setState({refreshing: false});
      }, false);
    },
    )
  }
  // BG

  getAllJobsDetails = async (callback, loading = true) => {
    const {screenProps} = this.props;
    if (!screenProps.isConnected) {
      return;
    }

    if (loading) this.setState({isLoading: true});

    const {
      searchText,
      pageNo,
      status,
      isLoadingMore,
      selectedStatus,
    } = this.state;
    let statusForApi = '';
    status.forEach(element => {
      if (statusForApi == '') {
        statusForApi = element;
      } else {
        statusForApi = statusForApi + ',' + element;
      }
    });
    try {
      let request = {
        searchText,
        pageNo,
        status: selectedStatus,
      };

      console.log('getAllJobs response isLoadingMore', isLoadingMore);

      let response = await API.getAllJobs(request);
      this.setState({isLoading: false});
      console.log('getAllJobs response', response);
      if (response.data) {
        this.setState(
          {
            jobsData: isLoadingMore
              ? [...this.state.jobsData, ...response.data.jobsData]
              : response.data.jobsData,
            count: response.data.count,
          },
          () => {
            this.props.navigation.setParams({isJobsData: this.state.jobsData.length > 0})
            if (callback) callback();
          },
        );

        if (response.data.jobsData.length > 0) {
          this.setState({
            jobId: response.data.jobsData[0]._id,
            jobStatus: response.data.jobsData[0].nStatus,
            jobTitle: response.data.jobsData[0].sJobTitle,
            acceptMilestonesStatus:
              response.data.jobsData[0].acceptedMilestoneStatus,
          });
        }
      }
    } catch (error) {
      console.log('getAllJobs error', error.message);
      this.setState({
        isLoading: false,
      });
    }
  };

  onFinalAcceptRejctJob = async (jobId, jobStatus, paymentType, cardId) => {
    const {screenProps} = this.props;
    if (!screenProps.isConnected) {
      return;
    }

    this.setState({isLoading: true});

    try {
      let request = {
        jobId: jobId,
        acceptStatus: jobStatus,
        isKycCompleted: Globals.isProfileCompleted
      };
      if (paymentType) {
        this.setState({paymentProceesing: true});
        request['paymentType'] = paymentType
        if (paymentType === PAYMENT_TYPE.CARD) {
          request['cardId'] = cardId
        }
      }

      let response = await API.acceptORrejectJob(request);
      this.setState({isLoading: false});
      console.log('acceptRejectJob response', response);
      if (paymentType) {
        setTimeout(() => {
          this.setState({
            isLoading: false,
            failedMessage: response.msg,
            paymentStatus: response.status
              ? PaymentStatus.success
              : PaymentStatus.failed,
          });
          setTimeout(() => {
            this.getInitials();
          }, 2000);
        }, 2000);
      } else {
        screenProps.callback(response)
      }
      if (response.status) {
        this.setState({isLoading: false});
        this.getAllJobsDetails(() => {
          this.setState({isLoading: false});
        }, true);
      }
    } catch (error) {
      console.log('acceptRejectJob error', error.message);
      this.setState(
        {
          isLoading: false,
        },
        () => {
          this.setState({isLoading: false});
        },
      );
    }
  };

  onAcceptRejectByBuilder = async (jobId, jobStatus) => {
    this.onFinalAcceptRejctJob(jobId, jobStatus);
  };

  getKYCstatusAPI = async () => {
    const {screenProps} = this.props;
    if (!screenProps.isConnected) {
      return;
    }

    this.setState({isLoading: true});
    try {
      let response = await API.checkKYCvalidation();
      this.setState({isLoading: false});
      if (response.status) {
        return true;
      } else {
        screenProps.callback(response);
        return false;
      }
    } catch (error) {
      console.log('checkKYCvalidation error', error.message);
      this.setState({isLoading: false});
      return false;
    }
  };


  onAcceptJobByClient = async () => {
    let jobsData = this.state.jobsData[0]
    // let allowed = await this.getKYCstatusAPI()
    // if (allowed) {
    this.props.navigation.push(Routes.CardView, {
      onGoBack: async (paymentType, paymentDetails) => {
        this.setState({paymentProceesing: true, milestonTitle: jobsData.ActiveMilestones.title || ''});

        let response = {status: true}
        if (paymentType === PAYMENT_TYPE.CARD) {
          paymentDetails.cardId ? (response['cardId'] = paymentDetails.cardId) : (response = await Mangopay.registerCard(paymentDetails))
        } else if (paymentType === PAYMENT_TYPE.BANK) {
          response['mandateId'] = undefined //paymentDetails.mandateId)
        }

        if (response.status) {
          setTimeout(() => {
            //response.cardId
            this.setState({milestonTitle: jobsData.ActiveMilestones.title})
            this.onFinalAcceptRejctJob(jobsData._id, 1, paymentType, paymentType === PAYMENT_TYPE.CARD ? response.cardId : response.mandateId)
          }, 2000);
        } else {
          setTimeout(() => {
            this.setState({isLoading: false, failedMessage: response.msg, paymentStatus: response.status ? PaymentStatus.success : PaymentStatus.failed});
            setTimeout(() => {
              this.getInitials()
            }, 2000);
          }, 1000)
        }
      }
    });
    // }
  }

  onFilterClick = () => {
    this.setState({
      isShowFilter: true
    })
  }
}
