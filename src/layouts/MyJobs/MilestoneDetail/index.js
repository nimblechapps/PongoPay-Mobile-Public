/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, View, TouchableOpacity} from 'react-native';
import Label from '../../../components/Label';
import Color from '../../../utils/color';
import HeaderTitle from '../../../components/Header/HeaderTitle';
import HeaderRight from '../../../components/Header/HeaderRight';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import KMButton from '../../../components/KMButton';
import ListButton from '../../../components/ListButton';
import {fontSmall14, fontXSmall16} from '../../../utils/theme';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import pongopayFontConfige from '../../../../selection.json';
import {Routes} from '../../../utils/Routes';
import {getMilestoneStatus} from '../../../utils/GetUserStatus';
import Globals, {
  contains,
  MilestoneStatus,
  issuesType,
  JobStatus,
  PAYMENT_TYPE,
  PAYMENT_STATUS,
  isValidValue,
  getBankAccountFromIBAN,
  getSortcodeFromIBAN,
} from '../../../utils/Globals';
import GlobalStyles from '../../../utils/GlobalStyles';
import PaymentView from '../../../components/PaymentView';

import API from '../../../API';

import {NavigationEvents} from 'react-navigation';
import {ErrorMessage} from '../../../utils/message';
import ProgressHud from '../../../components/ProgressHud';
import ConfirmModal from '../../../components/ConfirmModal';
import Mangopay from '../../../utils/mangopay';
import ToolTip from '../../../components/Tooltip';
import PaymentDetailModal from '../../../components/PaymentDetailModal';
const Icon = createIconSetFromIcoMoon(pongopayFontConfige);

const showReviewRequest = [
  MilestoneStatus.ON_GOING,
  MilestoneStatus.WORK_REVIEW_REQUEST,
  MilestoneStatus.REJECT_WITHOUT_DISPUTE,
];

const PaymentStatus = {
  processing: 0,
  success: 1,
  failed: 2,
};
export default class MilestoneDetail extends Component {
  static navigationOptions = ({navigation}) => {
    let showChat = navigation.getParam('showChat');
    let milestoneNo = navigation.state.params.milestoneDetails.nMilestoneNumber;
    return {
      headerTitle: () => <HeaderTitle title={`Payment Stage ${milestoneNo}`} />,
      headerRight: showChat ? (
        <HeaderRight
          iconName="chat"
          iconStyle={{fontSize: 26, color: Color.DarkGrey}}
          onPress={
            navigation.getParam('onChatClick')
            //navigation.navigate(Routes.Chat_View);
          }
        />
      ) : (
        // null
        <View style={{width: 30}} />
      ),
    };
  };

  constructor(props) {
    super(props);
    const {params = {}} = props.navigation.state;
    this.state = {
      isLoading: false,
      milestoneDetails: params.milestoneDetails,
      nextML: params.nextML || {},
      prevML: params.prevML || {},
      isLastMilestone: params.isLastMilestone || false,
      jobDetails: params.jobDetails,
      jobAmount: params.jobAmount,
      milestonePendingAmount: params.milestonePendingAmount,
      acceptMilestoneByClient: params.acceptMilestoneByClient,
      isDispute: false,
      paymentProceesing: false,
      paymentStatus: PaymentStatus.processing,
      showConfirm: false,
      showPaymentDetailModal: false,
    };
    console.log(
      this.state.acceptMilestoneByClient,
      'params.acceptMilestoneByClient',
    );
  }

  getInitials() {
    this.setState({
      bankwireModal: false,
      isLoading: false,
      paymentProceesing: false,
      paymentStatus: PaymentStatus.processing,
    });
  }

  componentDidMount() {
    let mlStatusArr = [
      MilestoneStatus.ON_GOING,
      MilestoneStatus.WORK_REVIEW_REQUEST,
      MilestoneStatus.COMPLETED,
      MilestoneStatus.DISPUTE,
    ];
    let {milestoneDetails} = this.state;
    if (milestoneDetails.DisputeMilestone.length > 0) {
      this.setState({
        isDispute: milestoneDetails.DisputeMilestone[0].hasOwnProperty(
          'nResultStatus',
        ),
      });
    }

    this.props.navigation.setParams({
      onChatClick: this.onChatClick,
      showChat: contains(mlStatusArr, milestoneDetails.nMilestoneStatus),
    });
  }

  onChatClick = () => {
    let {jobDetails, milestoneDetails} = this.state;
    this.props.navigation.navigate(Routes.Chat_View, {
      jobDetails: jobDetails,
      milestoneNumber: milestoneDetails.nMilestoneNumber,
    });
  };

  onCreate() {
    // if(this.state.milestoneDetails != undefined){
    //     console.log("m", this.state.milestoneDetails)
    // }
  }

  async onReviewRequestWebService() {
    let milestone = this.state.milestoneDetails;
    this.setState({isLoading: true, showConfirm: false});
    try {
      let request = {
        milestoneId: milestone._id,
        milestoneNumber: milestone.nMilestoneNumber,
      };
      console.log('param', request);

      let response = await API.milestoneReviewRequest(request);
      this.setState({isLoading: false});
      console.log('milestoneReviewRequest response', response);
      if (response.status) {
        if (response.data) {
          this.setState({
            milestoneDetails: response.data,
          });
        }
        const {screenProps} = this.props;
        if (!screenProps.isConnected) {
          return;
        }
        screenProps.callback(response);
      }
    } catch (error) {
      console.log('milestoneReviewRequest error', error.message);
      this.setState({isLoading: false});
    }
  }

  onReviewRequest = async () => {
    this.setState({
      showConfirm: true,
      confirmMsg:
        'Have you completed all tasks as per payment stage description?',
      confirmFnc: () => this.onReviewRequestWebService(),
      hideFnc: () => {
        this.setState({showConfirm: false});
        const {screenProps} = this.props;
        if (!screenProps.isConnected) {
          return;
        }
        let response = {
          status: false,
          msg: 'All tasks must be complete before payment request is sent',
        };
        screenProps.callback(response);
      },
    });
  };

  async onFinalApproveMilestone(milestone, paymentType, cardId) {
    try {
      let request = {
        milestoneId: milestone._id,
        milestoneNumber: milestone.nMilestoneNumber,
        jobId: milestone.oJobId,
      };
      this.setState({
        paymentProceesing: true,
        milestoneTitle: milestone.sMilestoneTitle,
        escrow: false,
      });

      let response = await API.milestoneCompleted(request);
      this.setState({isLoading: false});
      console.log('milestoneCompleted response', response);

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
      if (response.status) {
        if (response.data) {
          this.setState({
            milestoneDetails: response.data,
          });
        }
      }
    } catch (error) {
      console.log('milestoneCompleted error', error.message);
      this.setState({isLoading: false});
    }
  }

  async onFinalEscrowMilestone(milestone, paymentType, cardId, onlineTransfer) {
    this.setState({isLoading: true});
    let {milestones} = this.state;
    try {
      let request = {
        milestoneId: milestone._id,
        jobId: milestone.oJobId,
      };

      this.setState({paymentProceesing: true});

      if (paymentType) {
        this.setState({paymentProceesing: true});
        request['paymentType'] = paymentType;
        if (cardId) {
          request['cardId'] = cardId;
        }
        if (onlineTransfer) {
          request['onlineTransfer'] = onlineTransfer;
        }
      }

      console.log('escrow milestone request', request);
      let response = await API.milestoneStarted(request);
      console.log('escrow milestone response==>', response);

      if (paymentType || milestone.isLastMilestone) {
        setTimeout(async () => {
          if (response.data?.payment_escrow_detail?.paymentType == 'BANK') {
            if (response.status) {
              if (onlineTransfer && response.onlineTransferUrl) {
                this.makeOnlineTransfer(response.onlineTransferUrl);
              } else {
                this.getInitials();
                this.setState({
                  showPaymentDetailModal: true,
                  paymentDetails: response.data?.payment_escrow_detail,
                  milestoneStatus: response.data?.nMilestoneStatus,
                  milestoneAmount: response.data.nMilestoneAmount,
                });
              }
            } else {
              this.setState({
                isLoading: false,
                nextMilestone: response.data,
                failedMessage: response.msg,
                paymentStatus: response.status
                  ? PaymentStatus.success
                  : PaymentStatus.failed,
              });
            }
          } else {
            if (response?.data?.SecureModeRedirectURL) {
              this.handleSecurePayment(
                response?.data?.SecureModeRedirectURL,
                async () =>
                  await this.onFinalApproveMilestone(
                    milestone,
                    PAYMENT_TYPE.CARD,
                  ),
              );
            } else {
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
            }
          }
        }, 2000);
      }

      if (response.status) {
        if (response.data) {
          this.setState({
            milestoneDetails: response.data,
          });
        }
      }
    } catch (error) {
      console.log('milestoneCompleted error', error.message);
      const {screenProps} = this.props;
      if (!screenProps.isConnected) {
        return;
      }
      screenProps.callback(ErrorResponse);
      this.setState({isLoading: false});
    }
  }

  onHandlePayment = milestone => {
    this.props.navigation.push(Routes.CardView, {
      onGoBack: async (paymentType, paymentDetails) => {
        this.setState({
          paymentProceesing: true,
          milestoneTitle: milestone.sMilestoneTitle,
          escrow: true,
        });
        let response = {status: true};

        if (paymentType === PAYMENT_TYPE.CARD) {
          paymentDetails.cardId
            ? (response['cardId'] = paymentDetails.cardId)
            : (response = await Mangopay.registerCard(paymentDetails));
        } else {
          response['onlineTransfer'] = paymentDetails.onlineTransfer;
        }

        if (response.status) {
          setTimeout(() => {
            this.onFinalEscrowMilestone(
              milestone,
              paymentType,
              response?.cardId,
              response?.onlineTransfer,
            );
          }, 2000);
        } else {
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
          }, 1000);
        }
      },
    });
  };

  onEscrowMilestone = milestone => {
    this.setState({
      showConfirm: true,
      confirmMsg: `Are you sure you want to pay the deposit for payment stage ${milestone.sMilestoneTitle
        }?`,
      confirmFnc: () => this.onHandlePayment(milestone),
      hideFnc: () => this.setState({showConfirm: false}),
    });
  };

  onApproveMilestone = async milestone => {
    this.setState({
      showConfirm: true,
      confirmMsg: `Are you sure you want to release payment for the payment stage ${milestone.sMilestoneTitle
        }?`,
      confirmFnc: () => this.onFinalApproveMilestone(milestone),
      hideFnc: () => this.setState({showConfirm: false}),
    });
  };

  handleSecurePayment = (SecureModeRedirectURL, func) => {
    if (isValidValue(SecureModeRedirectURL)) {
      this.setState({
        paymentProceesing: true,
        openUrl: SecureModeRedirectURL,
        onVerificationSuccess: func,
      });
    }
  };

  makeOnlineTransfer = url => {
    this.handleSecurePayment(url, async () => {
      this.getInitials();
    });
  };

  initiateOnlineTransfer = async milestone => {
    if (milestone.payment_escrow_detail) {
      let bankDetails = milestone?.payment_escrow_detail?.bankDetails;
      if (bankDetails) {
        let benificiary = {
          name: bankDetails.OwnerName,
          reference: milestone?.payment_escrow_detail?.transaction_ref,
          account_number: getBankAccountFromIBAN(bankDetails.IBAN),
          sort_code: getSortcodeFromIBAN(bankDetails.IBAN),
        };
        let banking_url = await Mangopay.banking(
          milestone.nEscrowAmount,
          benificiary,
        );
        if (banking_url) {
          this.makeOnlineTransfer(banking_url);
        }
      }
    }
  };

  onRaiseDisputeWebService = async () => {
    this.setState({isLoading: true, showConfirm: false});
    let milestone = this.state.milestoneDetails;
    try {
      let request = {
        milestoneId: milestone._id,
        milestoneNumber: milestone.nMilestoneNumber,
      };
      console.log('param', request);

      let response = await API.raiseDispute(request);
      this.setState({isLoading: false});
      console.log('raiseDispute response', response);
      if (response.status) {
        if (response.data) {
          this.setState({
            milestoneDetails: response.data,
          });
        }
      }
      const {screenProps} = this.props;
      if (!screenProps.isConnected) {
        return;
      }
      screenProps.callback(response);
    } catch (error) {
      console.log('raiseDispute error', error.message);
      this.setState({isLoading: false});
    }
  };

  onRaiseDispute = async () => {
    this.setState({
      showConfirm: true,
      confirmMsg: 'Are you sure you want to raise a dispute?',
      confirmFnc: () => this.onRaiseDisputeWebService(),
      hideFnc: () => {
        this.setState({showConfirm: false});
      },
    });
  };

  isFailedPayment = m => {
    let {jobDetails} = this.state;
    let isFailed = undefined;
    if (
      Globals.isClient &&
      m.nMilestoneNumber != 1 &&
      m.payment_status !== PAYMENT_STATUS.COMPLETE
    ) {
      if (
        m.payment_status === PAYMENT_STATUS.FAILED &&
        jobDetails.nAcceptClientStatus == 1
      ) {
        isFailed = true;
      } else if (m.nMilestoneStatus === MilestoneStatus.AWAITING_PAYMENT) {
        isFailed = false;
      }
    }
    return isFailed;
  };

  isPartialPayment = m => {
    let isPartial = undefined;
    if (Globals.isClient) {
      isPartial = m?.payment_escrow_detail?.onlineTransferSuccess === false;
    }
    return isPartial;
  };

  render() {
    const {navigate, replace} = this.props.navigation;
    const {
      bankwireModal,
      isLastMilestone,
      openUrl,
      paymentProceesing,
      paymentStatus,
      failedMessage,
      isLoading,
      jobDetails,
      nextML,
      milestoneDetails,
      jobAmount,
      milestonePendingAmount,
      acceptMilestoneByClient,
    } = this.state;
    let reviewRequestDisabled =
      milestoneDetails.nMilestoneStatus ===
      MilestoneStatus.WORK_REVIEW_REQUEST ||
      milestoneDetails.nMilestoneStatus === MilestoneStatus.DISPUTE;
    let userVerified = this.props.screenProps?.isVerified;
    let payment_escrow_detail = milestoneDetails.payment_escrow_detail
      ? milestoneDetails.payment_escrow_detail
      : {};
    let hasRejectionComments = milestoneDetails.rejectComments
      ? milestoneDetails.rejectComments.length != 0
      : false;
    console.log(acceptMilestoneByClient, 'acceptMilestoneByClient');

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeVStyle}>
          <KeyboardAwareScrollView>
            <View
              style={{
                paddingRight: 16,
                paddingLeft: 16,
                paddingTop: 24,
                paddingBottom: 0,
                borderBottomWidth: 0,
                borderBottomColor: Color.WhiteGrey,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Label fontSize_16 Montserrat_Medium mb={16}>
                  {milestoneDetails.sMilestoneTitle}
                </Label>
                {/* Globals.isBuilder && !acceptMilestoneByClient && */}
                {Globals.isBuilder && !acceptMilestoneByClient && (
                  <TouchableOpacity
                    onPress={() =>
                      replace(Routes.Edit_Milestone, {
                        milestone: milestoneDetails,
                        jobDetails: jobDetails,
                        jobAmount: jobAmount,
                        milestonePendingAmount: milestonePendingAmount,
                        from: 'MilestonDetail',
                      })
                    }>
                    <Label
                      fontSize_16
                      Montserrat_Medium
                      mb={16}
                      color={Color.LightBlue}>
                      Edit
                    </Label>
                  </TouchableOpacity>
                )}
              </View>
              {milestoneDetails.sMilestoneDesc != '' && (
                <View style={{paddingTop: 0, paddingBottom: 10}}>
                  <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>
                    Payment Stage Description:
                  </Label>
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.DarkGrey}
                    mt={5}>
                    {milestoneDetails.sMilestoneDesc}
                  </Label>
                </View>
              )}
              <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
                <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>
                  Payment Stage Status:
                </Label>
                <Label
                  fontSize_14
                  Montserrat_Medium
                  color={Color.DarkGrey}
                  ml={5}>
                  {
                    getMilestoneStatus(milestoneDetails.nMilestoneStatus)
                      .milestoneStatus
                  }
                </Label>
              </View>
              {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, }}>
                                <KMButton
                                    title="Modification Request"
                                    style={Globals.isIpad ? styles.buttonPad : styles.button}
                                    onPress={() => navigate(Routes.Milestone_Modification_Requests)}
                                    textStyle={{ color: Color.WHITE, fontSize: fontSmall14, fontFamily: 'Montserrat-Medium', }} />
                            </View> */}
            </View>
            <View
              style={{
                paddingRight: 16,
                paddingLeft: 16,
                paddingTop: 10,
                paddingBottom: 24,
                borderBottomWidth: 1,
                borderBottomColor: Color.WhiteGrey,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 8,
                  flex: 1,
                  flexWrap: 'wrap',
                }}>
                <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>
                  Payment Stage Amount:
                </Label>
                <Label
                  fontSize_14
                  Montserrat_Medium
                  color={Color.DarkGrey}
                  ml={5}>
                  £ {milestoneDetails.nMilestoneAmount}
                </Label>
              </View>
              {Globals.isBuilder && (
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: 8,
                    flex: 1,
                    flexWrap: 'wrap',
                  }}>
                  <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>
                    Service Fee:
                  </Label>
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.DarkGrey}
                    ml={5}>
                    £ {milestoneDetails.nAdminComission}
                  </Label>
                </View>
              )}
              {milestoneDetails.nPropertyManagerComission > 0 &&
                Globals.isBuilder && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 8,
                      flex: 1,
                      flexWrap: 'wrap',
                    }}>
                    <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>
                      Property Manager Comission:
                    </Label>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.DarkGrey}
                      ml={5}>
                      £ {milestoneDetails.nPropertyManagerComission}
                    </Label>
                  </View>
                )}
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 8,
                  flex: 1,
                  flexWrap: 'wrap',
                }}>
                <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>
                  Paid Amount:
                </Label>
                <Label
                  fontSize_14
                  Montserrat_Medium
                  color={Color.DarkGrey}
                  ml={5}>
                  £ {milestoneDetails.nMilestoneAmount}
                </Label>
              </View>
              {/* <View style={{ flexDirection: 'row', marginBottom: 8, flex: 1, flexWrap: 'wrap' }}>
                                <Label fontSize_14 Montserrat_Bold color={Color.BLACK} >Upcoming Deposit Amount:</Label>
                                <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>{ErrorMessage.currencyIcon + " " + milestoneDetails.nMilestoneAmount}</Label>
                            </View> */}
              {payment_escrow_detail?.transaction_ref &&
                !payment_escrow_detail.hasOwnProperty(
                  'onlineTransferSuccess',
                ) &&
                Globals.isClient &&
                Globals.isClient && (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 8,
                      flex: 1,
                      flexWrap: 'wrap',
                    }}>
                    {/* if accepted milestones remove upcomin else add upcoming */}
                    <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>
                      Payment Reference:
                    </Label>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.DarkBlue}
                      ml={5}
                      mr={4}
                      style={{paddingTop: 2}}>
                      {payment_escrow_detail?.transaction_ref}
                    </Label>
                    <ToolTip
                      onClickPress={() =>
                        this.setState({
                          showPaymentDetailModal: !this.state
                            .showPaymentDetailModal,
                        })
                      }
                    />
                  </View>
                )}

              {Globals.isBuilder &&
                contains(
                  showReviewRequest,
                  milestoneDetails.nMilestoneStatus,
                ) &&
                JobStatus.ON_GOING === jobDetails.nStatus && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <KMButton
                      title={
                        reviewRequestDisabled
                          ? 'Payment Requested'
                          : 'Request Payment'
                      }
                      disabled={reviewRequestDisabled || !userVerified}
                      onPress={() => this.onReviewRequest(milestoneDetails)}
                      style={[
                        styles.kmbutton,
                        {
                          width: '100%',
                          backgroundColor:
                            reviewRequestDisabled || !userVerified
                              ? Color.GreyButton
                              : Color.LightBlue,
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
              {this.isFailedPayment(milestoneDetails) !== undefined && (
                <View>
                  {this.isFailedPayment(milestoneDetails) === true && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <KMButton
                        title={'Retry Payment'}
                        onPress={() => this.onEscrowMilestone(milestoneDetails)}
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
                  {this.isFailedPayment(milestoneDetails) === false && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <KMButton
                        title={'Make Payment'}
                        onPress={() => this.onEscrowMilestone(milestoneDetails)}
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
              )}
              {this.isPartialPayment(milestoneDetails) === true && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <KMButton
                    title={'Retry Payment'}
                    onPress={() =>
                      this.initiateOnlineTransfer(milestoneDetails)
                    }
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
              {!Globals.isBuilder &&
                milestoneDetails.nMilestoneStatus ===
                MilestoneStatus.WORK_REVIEW_REQUEST && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <KMButton
                      title={'Release Payment'}
                      onPress={() => this.onApproveMilestone(milestoneDetails)}
                      style={[
                        styles.kmbutton,
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
                    {/* <KMButton
                                    title={'Raise Dispute'}
                                    onPress={() => this.onRaiseDispute(milestoneDetails)}
                                    textStyle={{ color: Color.LightBlue, fontSize: fontXSmall16, fontFamily: 'Montserrat-Medium' }}
                                    style={[styles.kmbutton, { backgroundColor: "transparent", borderWidth: 1, borderColor: Color.LightBlue }]} /> */}
                  </View>
                )}
            </View>
            {Globals.isBuilder && milestoneDetails.PropertyManager && (
              <View
                style={{
                  paddingRight: 16,
                  paddingLeft: 16,
                  paddingTop: 24,
                  borderBottomWidth: 1,
                  paddingBottom: 24,
                  borderBottomColor: Color.WhiteGrey,
                }}>
                <View style={{flexDirection: 'row', marginBottom: 8}}>
                  <Label fontSize_14 Montserrat_Bold color={Color.BLACK}>
                    Property Manager Commission:
                  </Label>
                  {/* <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>£ 6587.700</Label> */}
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.DarkGrey}
                    ml={5}>
                    £ {milestoneDetails.nPropertyManagerComission}
                  </Label>
                </View>
                {/* <View style={{ flexDirection: 'row', marginBottom: 8, }}>
                                    <Label fontSize_14 Montserrat_Medium color={Color.BLACK} >PongoPay service fee:</Label>
                                    <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} ml={5}>£ {milestoneDetails.nAdminComission}</Label>
                                </View> */}
              </View>
            )}
            {Globals.isBuilder &&
              !contains(
                [MilestoneStatus.PENDING, MilestoneStatus.ACCEPTED],
                milestoneDetails.nMilestoneStatus,
              ) && (
                <View>
                  {/* builder */}
                  <ListButton
                    onPress={() =>
                      navigate(Routes.Work_Progress_List, {
                        milestoneId: milestoneDetails._id,
                        jobId: jobDetails._id,
                        type: 0,
                        jobDetails: this.state.jobDetails,
                        milestone: milestoneDetails,
                      })
                    }
                    Title="Building Issues"
                  />
                  {hasRejectionComments && (
                    <ListButton
                      onPress={() =>
                        navigate(Routes.Milestone_Rejection_Comments, {
                          milestoneDetails: milestoneDetails,
                        })
                      }
                      Title="Further Action Requested"
                      showNewView={milestoneDetails.newRejectComment}
                    />
                  )}
                  <ListButton
                    onPress={() =>
                      navigate(Routes.Work_Progress_List, {
                        milestoneId: milestoneDetails._id,
                        jobId: jobDetails._id,
                        type: 1,
                        jobDetails: this.state.jobDetails,
                        milestone: milestoneDetails,
                      })
                    }
                    Title="Work Progress"
                  />
                  {contains(
                    showReviewRequest,
                    milestoneDetails.nMilestoneStatus,
                  ) && (
                      <ListButton
                        // info={"If you cannot resolve an issue with your Tradesperson, request to open a formal dispute"}
                        toolTipPosition={'top'}
                        onPress={() => this.onRaiseDispute()}
                        Title="Raise Dispute"
                      />
                    )}
                </View>
              )}

            {!Globals.isBuilder &&
              !contains(
                [MilestoneStatus.PENDING, MilestoneStatus.ACCEPTED],
                milestoneDetails.nMilestoneStatus,
              ) && (
                <View>
                  {/* client */}
                  {milestoneDetails.nMilestoneStatus ===
                    MilestoneStatus.WORK_REVIEW_REQUEST && (
                      <ListButton
                        onPress={() =>
                          navigate(Routes.Reject_Work, {
                            milestoneDetails: milestoneDetails,
                            onGoBack: result =>
                              result && this.setState({milestoneDetails: result}),
                          })
                        }
                        Title="Request Tradesperson Action"
                        info="Raise an issue with work without requesting a formal dispute"
                      />
                    )}
                  <ListButton
                    onPress={() =>
                      navigate(Routes.Work_Progress_List, {
                        milestoneId: milestoneDetails._id,
                        jobId: jobDetails._id,
                        type: 1,
                        jobDetails: this.state.jobDetails,
                        milestone: milestoneDetails,
                      })
                    }
                    Title="Work Progress"
                    info="Your Tradesperson may add progress photos and comments in this area"
                  />
                  <ListButton
                    onPress={() =>
                      navigate(Routes.Work_Progress_List, {
                        milestoneId: milestoneDetails._id,
                        jobId: jobDetails._id,
                        type: 0,
                        jobDetails: this.state.jobDetails,
                        milestone: milestoneDetails,
                      })
                    }
                    Title="Building Issues"
                  />
                  {milestoneDetails.nMilestoneStatus ===
                    MilestoneStatus.WORK_REVIEW_REQUEST && (
                      <ListButton
                        info={
                          'If you cannot resolve an issue with your Tradesperson, request to open a formal dispute'
                        }
                        onPress={() => this.onRaiseDispute()}
                        toolTipPosition={'top'}
                        Title="Raise Dispute"
                      />
                    )}

                  {hasRejectionComments && (
                    <ListButton
                      onPress={() =>
                        navigate(Routes.Milestone_Rejection_Comments, {
                          milestoneDetails: milestoneDetails,
                        })
                      }
                      Title="Payment Stage Further Action Requested"
                    />
                  )}
                </View>
              )}
          </KeyboardAwareScrollView>
        </SafeAreaView>
        {this.state.isDispute && (
          <KMButton
            fontSize_16
            Montserrat_Medium
            color={Color.BLACK}
            title="CONCLUSION"
            textStyle={{padding: 0}}
            style={[GlobalStyles.bottomButtonStyle, {borderRadius: 0}]}
            onPress={() =>
              navigate(Routes.Conclusion_Accepted, {
                isLastMilestone: this.state.isLastMilestone,
                milestoneDetails: milestoneDetails,
                nextML: nextML,
                jobDetails: this.state.jobDetails,
              })
            }
          />
        )}
        {isLoading && <ProgressHud />}
        <ConfirmModal
          show={this.state.showConfirm}
          onHide={this.state.hideFnc}
          onConfirm={() => {
            this.setState({showConfirm: false});
            this.state.confirmFnc();
          }}
          msg={this.state.confirmMsg}
        />
        <PaymentView
          paymentProceesing={paymentProceesing}
          paymentStatus={paymentStatus}
          failedMessage={failedMessage}
          escrow={this.state.escrow}
          jobTitle={this.state.milestoneTitle}
          nextMilestone={this.state.nextMilestone}
          openUrl={openUrl}
          onVerificationSuccess={() => {
            this.setState({openUrl: ''});
            this.state.onVerificationSuccess();
          }}
          onClose={() => this.getInitials()}
          bankwireModal={bankwireModal}
        />
        {milestoneDetails.payment_escrow_detail && (
          <PaymentDetailModal
            milestoneStatus={milestoneDetails.nMilestoneStatus}
            milestoneAmount={milestoneDetails.nMilestoneAmount}
            paymentDetails={milestoneDetails.payment_escrow_detail}
            show={this.state.showPaymentDetailModal}
            onClose={() => this.setState({showPaymentDetailModal: false})}
          />
        )}
        <NavigationEvents onWillFocus={this.onCreate} />
      </View>
    );
  }
}
