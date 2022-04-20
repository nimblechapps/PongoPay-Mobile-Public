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
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Linking,
  Text,
  Image,
  Dimensions,
  RefreshControl,
  Platform,
  AppState
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import CheckBox from 'react-native-check-box';
import * as Progress from 'react-native-progress';
import {SwipeListView} from 'react-native-swipe-list-view';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';

import Label from '../../../components/Label';
import KMButton from '../../../components/KMButton';
import HeaderLeft from '../../../components/Header/HeaderLeft';
import HeaderRight from '../../../components/Header/HeaderRight';
import ToastMessage from '../../../components/toastmessage';
import UserDetails from '../../../components/UserDetails';
import ProgressHud from '../../../components/ProgressHud';
import CustomIcon from '../../../components/CustomIcon';
import ConfirmModal from '../../../components/ConfirmModal';
import PaymentView from '../../../components/PaymentView';
import HeaderTitle from '../../../components/Header/HeaderTitle';
import ToolTip from '../../../components/Tooltip';
import GlobalStyles from '../../../utils/GlobalStyles';
import {Routes} from '../../../utils/Routes';
import Color from '../../../utils/color';
import {fontXSmall16, fontLarge24, fontNormal20} from '../../../utils/theme';
import {getJobStatus, getMilestoneStatus} from '../../../utils/GetUserStatus';
import {ErrorMessage} from '../../../utils/message';
import {getStoredData} from '../../../utils/store';
import Globals, {
  isValidValue,
  isValidIntValue,
  MilestoneStatus,
  contains,
  ErrorResponse,
  JobStatus,
  getValidNumber,
  timer,
  PAYMENT_TYPE,
  PAYMENT_STATUS,
  getKycRoute,
  getBankAccountFromIBAN,
  getSortcodeFromIBAN,
  dateDiff,
  nextPayoutDateTime
} from '../../../utils/Globals';
import Mangopay from '../../../utils/mangopay';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import PageControl from 'react-native-page-control';

import API from '../../../API';
import PaymentDetailModal from '../../../components/PaymentDetailModal';
import {width} from '../../../utils/dimensions';
import ListButton from '../../../components/ListButton';
import {isIphoneX} from 'react-native-iphone-x-helper';
// const images = {
//     TriangleImage: require('../../../assets/Images/Triangle_Withshadow.png')
// }
// const images = {
//     TriangleImage: require('../../../../src/assets/Images/logo.png')
// }
const bottomButton = {
  ACCEPT_JOB: 1,
  ADD_ML: 2,
  SUBMIT: 3,
  // MAKE_PAYMENT: 4,
  RESEND: 5
};
const PaymentStatus = {
  processing: 0,
  success: 1,
  failed: 2,
  payment_requested: 4,
};

const showReviewRequest = [
  MilestoneStatus.ON_GOING,
  MilestoneStatus.WORK_REVIEW_REQUEST,
  MilestoneStatus.REJECT_WITHOUT_DISPUTE,
];
export default class JobDetails extends Component {
  static navigationOptions = ({navigation}) => {
    let isEditJob = navigation.getParam('isEditable');
    let isJobAccepted = navigation.getParam('isJobAccepted');

    return {
      headerTitle: () => (
        <HeaderTitle title={isJobAccepted ? 'Job Overview' : 'Job Proposal'} />
      ),
      headerLeft: (
        <HeaderLeft
          iconName="left-arrow"
          onPress={() => {
            navigation.navigate(Routes.Job_Listing);
            navigation?.state?.params.onGoBack &&
              navigation.state.params.onGoBack();
          }}
        />
      ),
      headerRight:
        Globals.isBuilder && navigation.getParam('isEditable') ? (
          <HeaderRight
            buttonTitle="Edit Job"
            // onPress={() => navigation.navigate(Routes.Create_New_Job)}
            onPress={navigation.getParam('onEditJobClick')}
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
      processingDepositToolTip: false,
      paymentCompleteToolTip: false,
      isShowToast: false,
      isLoading: false,
      jobCount: params.jobCount,
      jobDetails: {},
      user: undefined,
      jobId: params.jobId,
      milestones: [],
      pendingAmount: 0,
      isInitial: false,
      bottomButtonType: bottomButton.ADD_ML,
      toast: {show: false, message: ''},
      modalVisible: false,
      jobByPM: true,
      canEdit: false,
      showConfirm: false,
      paymentProceesing: false,
      paymentStatus: PaymentStatus.processing,
      toolTip: false,
      showPaymentDetailModal: false,
      paymentDone: false,
      timerValue: 20,
      payment_reminder: [],
      currentIndex: 0,
      expanded: true,
      // BG
      refreshing: false,
      // BG

      mileStoneIndex: 0,

      isClose: false,
      appState: AppState.currentState,
      canReject: false,

    };
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
      this.onCreate()
    }

    if (nextAppState === 'inactive') {
      // Do something here on app inactive mode.
      console.log("App is in inactive Mode.")
    }
  };

  getInitials() {
    this.setState({
      bankwireModal: false,
      isLoading: false,
      paymentProceesing: false,
      paymentStatus: PaymentStatus.processing,
    });
  }

  componentDidMount() {

    Linking.addEventListener('url', e => {
      var self = this;
      console.log(e);
      self.getInitials();
      self.onCreate();
    });
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', () => {});
  }

  getJobDetails = async () => {
    const {screenProps} = this.props;
    if (!screenProps.isConnected) {
      return;
    }

    this.setState({isLoading: true});

    try {
      let request = {
        jobId: this.state.jobId,
      };
      let response = await API.getJobDetails(request);

      // console.log('==================================== response');
      // console.log(response.data.milestones);
      // console.log('====================================');

      this.setState({
        isLoading: false,
        refreshing: false,
      });

      if (response.status) {
        console.log(
          '=== response.data ====',
          response.data?.jobDetails?.ActiveMilestone,
        );

        // Active milestone.

        let index = 0;

        if (response.data?.jobDetails?.ActiveMilestone) {
          let mil = response.data.milestones;
          index = mil.findIndex((itm, index) => {
            return itm._id === response.data?.jobDetails?.ActiveMilestone._id;
          });
        }

        this.setState({
          currentIndex: index,
        });

        setTimeout(() => {
          if (this.scrollview_ref) {
            this.scrollview_ref.scrollTo({
              x: width * index,
              y: 0,
              animated: true,
            });
          }
        }, 500);

        let payment_reminder = response.data.milestones.filter(
          m => m.payment_reminder === true,
        );
        // if (payment_reminder.length > 0) {
        console.log(payment_reminder, 'paymnet**********************');

        this.setState({payment_reminder});
        // Globals.isClient && alert(`A Builder has requested payment for Payment Stage ${payment_reminder.sMilestoneTitle}`)
        // }
        this.getPartialPaymentTitle(response.data?.jobDetails?.ActiveMilestone);
        let canEdit = this.state.canEdit;
        let canReject = response.data?.jobDetails.nStatus == 2 ? true : false;

        let usedAmount = 0;
        for (milestone of response.data.milestones) {
          usedAmount += milestone.nMilestoneAmount;
        }
        usedAmount = Number(usedAmount.toFixed(2));
        if (
          response.data.jobDetails.oCreatedBy == this.state.user._id &&
          (response.data.jobDetails.nStatus == 0 ||
            response.data.jobDetails.nStatus == 1 ||
            response.data.jobDetails.nStatus == 2 ||
            response.data.jobDetails.nStatus == 5 ||
            response.data.jobDetails.nStatus == 22)
        ) {
          canEdit = true;
        } else {
          canEdit = false;
        }
        
        this.setState(
          {
            canEdit,
            canReject,
            isJobAccepted: !this.checkAcceptStatus(response.data),
            jobDetails: response.data.jobDetails,
            milestones: response.data.milestones,
            acceptMilestonesStatus:
              response.data.jobDetails.acceptedMilestoneStatus,
            pendingAmount: response.data.jobDetails.nJobAmount - usedAmount,
            bottomButtonType:
              response.data.jobDetails.nAcceptBuilderStatus != 1
                ? undefined
                : response.data.jobDetails.nJobAmount - usedAmount == 0
                  ? bottomButton.SUBMIT
                  : bottomButton.ADD_ML,
          },
          () => {
            this.props.navigation.setParams({
              isEditable: this.state.canEdit,
            });
            this.showHideEditJob();
          },
        );

        if (
          response.data.jobDetails.nStatus === JobStatus.AWAITING_RESPONSE &&
          response.data.jobDetails.nJobAmount - usedAmount == 0
        ) {
          this.setState({
            bottomButtonType: undefined,
          });
        }
        if (
          this.state.isJobAccepted &&
          response.data.jobDetails.nJobAmount - usedAmount == 0 &&
          response.data.jobDetails.nAcceptClientStatus == 1
        ) {
          this.setState({
            bottomButtonType: undefined,
          });
        }
        if(response.data.jobDetails.nStatus == JobStatus.REJECTED && response.data.jobDetails.nJobAmount - usedAmount == 0){
          this.setState({
            bottomButtonType: bottomButton.RESEND,
          });
        }
      }
    } catch (error) {
      console.log('getJobDetails error', error.message);
      this.setState({isLoading: false});
    }
  };

  _onMomentumScrollEnd = ({nativeEvent}) => {
    // the current offset, {x: number, y: number}
    const position = nativeEvent.contentOffset;
    // page index
    const index = Math.round(nativeEvent.contentOffset.x / width);

    if (index !== this.state.currentIndex) {
      this.setState({
        currentIndex: index,
      });
    }
  };

  onCreate = async () => {
    getStoredData(Globals.kUserData).then(value => {
      let result = JSON.parse(value);
      // console.log('jobListing UserData', result);
      this.setState({
        user: result,
      });
    });

    await this.getJobDetails();
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setConfirmModalVisible(visible) {
    this.setState({showConfirm: visible});
  }

  onReviewRequest = async milestone => {
    this.setState({
      isLoading: true,
      showConfirm: false,
    });
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
        const {screenProps} = this.props;
        if (!screenProps.isConnected) {
          return;
        }
        screenProps.callback(response);
        this.getJobDetails();
      }
    } catch (error) {
      console.log('milestoneReviewRequest error', error.message);
      const {screenProps} = this.props;
      if (!screenProps.isConnected) {
        return;
      }
      screenProps.callback(ErrorResponse);
      this.setState({isLoading: false});
    }
  };

  async onCancelNextPayment(jobId, milestoneNumber) {
    let request = {
      milestoneNumber: milestoneNumber,
      jobId: jobId,
    };
    await API.pendingNextPaymentStage(request);
    this.getJobDetails();
  }

  async reminderForPayment(milestone) {
    let request = {
      milestoneId: milestone._id,
    };
    await API.reminderForPayment(request);
    this.getJobDetails();
  }

  async escrowNextPaymentStage(milestone) {
    let {milestones} = this.state;
    let nextPayment = milestones.filter(
      m => m.nMilestoneNumber === milestone.nMilestoneNumber + 1,
    );
    nextPayment.length !== 0 && this.onEscrowMilestone(nextPayment[0]);
  }

  async onFinalApproveMilestone(milestone, paymentType, cardId) {
    this.setState({isLoading: true});
    let {milestones} = this.state;
    try {
      let request = {
        milestoneId: milestone._id,
        milestoneNumber: milestone.nMilestoneNumber,
        jobId: milestone.oJobId,
      };

      this.setState({
        paymentProceesing: true,
        isClose: false,
        milestoneTitle: milestone.sMilestoneTitle,
        escrow: false,
      });
      let response = await API.milestoneCompleted(request);
      console.log('milestone Complete response==>', response);

      this.setState({
        isLoading: false,
        failedMessage: response.msg,
        paymentStatus: response.status
          ? PaymentStatus.success
          : PaymentStatus.failed,
      });
      setTimeout(() => {
        this.getInitials();
        !milestone.isLastMilestone &&
          this.setState({
            showConfirm: true,
            confirmMsg: `Would you like to begin the next payment stage?`,
            confirmFnc: () => this.escrowNextPaymentStage(milestone),
            hideFnc: () => {
              this.setState({showConfirm: false});
              this.onCancelNextPayment(
                milestone.oJobId,
                milestone.nMilestoneNumber,
              );
            },
          });
      }, 2000);
      this.getJobDetails();
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

  async onFinalEscrowMilestone(
    milestone,
    paymentType,
    cardId,
    onlineTransfer,
    providerId,
  ) {
    this.setState({isLoading: true});
    let {milestones} = this.state;
    try {
      let request = {
        milestoneId: milestone._id,
        jobId: milestone.oJobId,
      };

      this.setState({paymentProceesing: true, isClose: false});

      if (paymentType) {
        this.setState({paymentProceesing: true, isClose: false});
        request['paymentType'] = paymentType;
        if (cardId) {
          request['cardId'] = cardId;
        }
        if (onlineTransfer) {
          request['onlineTransfer'] = onlineTransfer;

          // SANDBOX
          // request['remitter_id'] = 'mock-payments-gb-redirect';

          // LIVE
          request['remitter_id'] = providerId;
        }
      }

      console.log('escrow milestone request', request);
      setTimeout(() => {
          this.setState({
            paymentProceesing: false,
          });
        }, 30000);
      let response = await API.milestoneStarted(request);
      console.log('escrow milestone response==>', response);

      if (paymentType || milestone.isLastMilestone) {
        setTimeout(async () => {
          if (response.data?.payment_escrow_detail?.paymentType == 'BANK') {
            if (response.status) {
              if (onlineTransfer && response.onlineTransferUrl) {
                this.handleSecurePayment(
                  response.onlineTransferUrl,
                  async () => {
                    this.getInitials();
                  },
                );
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
                  await this.onFinalEscrowMilestone(
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

      this.getJobDetails();
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
      onGoBack: async (paymentType, paymentDetails, verified, providerId) => {
        this.setState({
          paymentProceesing: true,
          milestoneTitle: milestone.sMilestoneTitle,
          escrow: true,
          isClose: false
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
              providerId,
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

  makeOnlineTransfer = url => {
    this.handleSecurePayment(url, async () => {
      this.getJobDetails();
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
      confirmFnc: () => this.onFinalApproveMilestone(milestone, ''),
      hideFnc: () => this.setState({showConfirm: false}),
    });
  };

  onCancelJob = async (jobId, status) => {
    this.setState({isLoading: true});
    try {
      let request = {
        jobId: jobId,
      };
      if (Globals.isBuilder) {
        request['nCancellationRequestAcceptByBuilder'] = parseInt(status);
      } else {
        request['nCancellationRequestAcceptByClient'] = parseInt(status);
      }
      console.log('param', request);

      let response = await API.cancelJob(request);
      this.setState({isLoading: false});
      console.log('cancelJob response', response);
      const {screenProps} = this.props;
      if (!screenProps.isConnected) {
        return;
      }
      screenProps.callback(response);
      if (response.status) {
        this.getJobDetails();
      }
    } catch (error) {
      console.log('cancelJob error', error.message);
      const {screenProps} = this.props;
      if (!screenProps.isConnected) {
        return;
      }
      screenProps.callback(ErrorResponse);
      this.setState({isLoading: false});
    }
  };

  onDeleteJob = async jobId => {
    this.setState({isLoading: true});
    try {
      let request = {
        jobId: jobId,
      };

      console.log('param', request);

      let response = await API.deleteJob(request);
      this.setState({isLoading: false});
      console.log('deleteJob response', response);
      const {screenProps} = this.props;
      if (!screenProps.isConnected) {
        return;
      }
      screenProps.callback(response);
      if (response.status) {
        this.props.navigation.goBack();
      }
    } catch (error) {
      console.log('cancelJob error', error.message);
      const {screenProps} = this.props;
      if (!screenProps.isConnected) {
        return;
      }
      screenProps.callback(ErrorResponse);
      this.setState({isLoading: false});
    }
  };

  onDeleteMilestoneConfirm(m) {
    this.setState({
      deleteMilestoneId: m._id,
      deleteMilestoneName: m.sMilestoneTitle,
      showConfirm: true,
      confirmMsg: 'Are you sure you want to remove this Payment Stage?',
      confirmFnc: () => this.onDeleteMilestone(),
      hideFnc: () => this.setState({showConfirm: false}),
    });
  }

  async onReviewRequestConfirm(m) {
    let userVerified = this.props.screenProps?.isVerified;
    if (userVerified) {
      this.setState({
        showConfirm: true,
        confirmMsg:
          'Have you completed all tasks as per payment stage description?',
        confirmFnc: () => this.onReviewRequest(m),
        hideFnc: () => {
          const {screenProps} = this.props;
          if (!screenProps.isConnected) {
            return;
          }
          let response = {
            status: false,
            msg: 'All tasks must be complete before payment request is sent',
          };
          screenProps.callback(response);
          this.setState({showConfirm: false});
        },
      });
    } else {
      const {navigate} = this.props.navigation;
      let routeName = await getKycRoute('bank', this.state.user);
      navigate(routeName, {
        backRoute: Routes.Conclusion_Accepted,
      });
    }
  }

  onRejectButtonClick (){
    this.setModalVisible(false);
    this.setState({
      showConfirm: true,
      confirmMsg: `Are you sure you want to reject this job?`,
      confirmFnc: () => this.onFinalAcceptRejctJob(2),
      hideFnc: () => {
          this.setState({showConfirm: false}); 
          this.setModalVisible(true);
        },
    });
  };

  onFinalAcceptRejctJob = async (
    jobStatus,
    paymentType,
    verified,
    cardId,
    onlineTransfer,
    providerId,
  ) => {
    const {screenProps} = this.props;
    if (!screenProps.isConnected) {
      return;
    }
    if(jobStatus == 2){      
      this.setModalVisible(false);
      this.rejectJob();      
      return;
    }
    this.setState({paymentProceesing: verified, isClose: false});
      const {jobId, milestones} = this.state;
      try {
        let request = {
          jobId: jobId,
          acceptStatus: jobStatus,
          isKycCompleted: verified,
        };
        if (paymentType) {
          request['paymentType'] = paymentType;
          if (cardId) {
            request['cardId'] = cardId;
          }
          if (onlineTransfer) {
            request['onlineTransfer'] = onlineTransfer;
  
            // SANDBOX
            // request['remitter_id'] = 'mock-payments-gb-redirect';
  
            // LIVE
            request['remitter_id'] = providerId
          }
        }
        console.log('agreeDisagreeJob request', request);
        let response = await API.acceptORrejectJob(request);
        console.log('agreeDisagreeJob response', response);
        // if (!screenProps.isVerified) {
        //     screenProps.callback(response)
        //     setTimeout(async () => {
        //         const { navigate } = this.props.navigation;
        //         let routeName = await getKycRoute('bank', this.state.user)
        //         navigate(routeName)
        //     }, 1000);
        // } else {
        // !verified && screenProps.callback(response)
        if (paymentType) {
          setTimeout(async () => {
            response.status && (await this.getJobDetails());
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
                    await this.onFinalAcceptRejctJob(1, PAYMENT_TYPE.CARD),
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
        // }
      } catch (error) {
        console.log('agreeDisagreeJob error', error.message);
        this.setState({isLoading: false});
      }
  };

  async rejectJob() {

    let request = {
      jobId: this.state.jobId,
      acceptStatus: 2,
    }
    this.setState({isLoading: true});
    try{
      await API.acceptORrejectJob(request);
      await this.getJobDetails();
      this.onToastShow('Job rejected successfully')
    }
    catch(err){
      this.onToastShow('There was an error rejecting the job')
    }
    this.setState({isLoading: false});
  };

  handleSecurePayment = (SecureModeRedirectURL, func) => {
    console.log("=== SecureModeRedirectURL ====", SecureModeRedirectURL);
    if (this.state.paymentProceesing & isValidValue(SecureModeRedirectURL)) {
      Linking.openURL(SecureModeRedirectURL);
      this.setState({
        paymentProceesing: false,
        // openUrl: SecureModeRedirectURL,
        // onVerificationSuccess: func,
      });
    }
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

  showPaymentDetailModal(milestone) {
    if (!this.state.showPaymentDetailModal) {
      this.setState({
        paymentDetails: milestone.payment_escrow_detail,
        milestoneStatus: milestone?.nMilestoneStatus,
        milestoneAmount: milestone.nMilestoneAmount,
      });
    }
    this.setState({
      showPaymentDetailModal: !this.state.showPaymentDetailModal,
    });
  }

  onAcceptMilestones = async () => {
    const {screenProps} = this.props;
    this.props.navigation.push(Routes.CardView, {
      onGoBack: async (paymentType, paymentDetails, verified, providerId) => {
        this.setState({
          paymentProceesing: true,
          isClose: false,
          milestoneTitle: this.state.milestones[0].sMilestoneTitle,
        });
        let response = {status: true};
        if (paymentType === PAYMENT_TYPE.CARD) {
          paymentDetails.cardId
            ? (response['cardId'] = paymentDetails.cardId)
            : (response = await Mangopay.registerCard(paymentDetails));
        } else if (paymentType === PAYMENT_TYPE.BANK) {
          response['onlineTransfer'] = paymentDetails.onlineTransfer;
        }
        if (response.status) {
          setTimeout(() => {
            this.onFinalAcceptRejctJob(
              1,
              paymentType,
              verified,
              response?.cardId,
              response?.onlineTransfer,
              providerId,
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

  handleClick = () => {
    this.setState({toolTip: !this.state.toolTip});
  };

  isFailedPayment(m) {
    let {jobDetails} = this.state;
    let isFailed = undefined;
    if (
      Globals.isClient &&
      (m.nMilestoneStatus === MilestoneStatus.CARD_PAYMENT_FAILED ||
        m.nMilestoneStatus === MilestoneStatus.PAYMENT_REJECTED)
    ) {
      isFailed = true;
    } else if (
      Globals.isClient &&
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
  }

  getInfo(status) {
    // return `${Globals.isBuilder ? 'After your client makes the transfer' : 'After you make the transfer'}, ${ErrorMessage.bankUsageInfo}`

    // if (status === MilestoneStatus.PAYMENT_PROCESSING) {
    //     return `${Globals.isBuilder ? 'After your client makes the transfer' : 'After you make the transfer'}, ${ErrorMessage.bankUsageInfo}`
    // } else if (status === MilestoneStatus.COMPLETED) {
    //     return ErrorMessage.bankUsagePaidWarning
    // } else if (status === MilestoneStatus.DISPUTE) {
    //     return 'A PongoPay mediator will be in touch'
    // } else {
    //     return ''
    // }

    let description = '';
    const milestone = getMilestoneStatus(status);

    let {jobDetails} = this.state;

    console.log('=== JJJ ===');

    if (Globals.isBuilder) {
      if (getJobStatus(jobDetails.nStatus)[0] === 'Job Complete') {
        description = 'Congratulations! This job is now complete.';
      } else {
        description = milestone.BuilderDescription;
      }
    } else {
      if (getJobStatus(jobDetails.nStatus)[0] === 'Job Complete') {
        description = 'Congratulations! This job is now complete.';
      } else {
        description = milestone.ClientDescription;
      }
    }
    return description;
  }

  isPartialPayment = m => {
    console.log('partial payemnt', m);
    let isPartial = undefined;
    if (Globals.isClient) {
      isPartial = m?.payment_escrow_detail?.onlineTransferSuccess === false;
    }
    return isPartial;
  };

  getPartialPaymentTitle = m => {
    let me = this;
    let failedAt = m?.payment_escrow_detail?.onlineTransferFailedAt;
    if (failedAt) {
      const diffTime = Math.abs(new Date(failedAt) - new Date());
      let seconds = parseInt(Math.floor(diffTime / 1000));
      if (seconds >= 20) {
        this.setState({timerValue: 0});
      } else {
        let timerData = setInterval(() => {
          let {timerValue} = me.state;
          me.setState({
            timerValue: timerValue - 1,
          });
          if (timerValue === 0) {
            clearInterval(timerData);
          }
        }, 1000);
      }
    }
  };

  renderMilestone(m, index) {
    const {navigate} = this.props.navigation;
    let {milestones, jobDetails} = this.state;

    let mEscrowRequest =
      index > 0
        ? milestones[index - 1].nMilestoneStatus ==
        MilestoneStatus.WORK_REVIEW_REQUEST
        : false;

    let reviewRequestDisabled =
      m.nMilestoneStatus === MilestoneStatus.WORK_REVIEW_REQUEST ||
      m.nMilestoneStatus === MilestoneStatus.DISPUTE;
    let payment_escrow_detail = m.payment_escrow_detail
      ? m.payment_escrow_detail
      : {};

    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={styles.SwipeListView}
          onPress={() => {
            navigate(Routes.Milestone_Detail, {
              milestoneDetails: m,
              isLastMilestone: milestones.length === index + 1,
              prevML: milestones[index - 1],
              nextML: milestones[index + 1],
              jobDetails: this.state.jobDetails,
              jobAmount: this.state.jobDetails.nJobAmount,
              acceptMilestoneByClient: this.state.jobDetails
                .acceptedMilestoneStatus,
              milestonePendingAmount: this.state.pendingAmount,
            });
          }}>
          <View style={{width: '96%'}}>
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
                Payment Stage Title:{' '}
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
              <Label
                Montserrat_Medium
                fontSize_14
                color={Color.DarkGrey}
                style={{}}>
                Payment Stage Status:
              </Label>
              {/* <Label Montserrat_Medium fontSize_14 color={Color.LightBlue} ml={4}>{getMilestoneStatus(m.nMilestoneStatus).milestoneStatus}</Label> */}
              <View
                style={{
                  flexDirection: 'row',
                  // marginLeft: 5,
                  alignItems: 'center',
                  // marginBottom: 10,
                }}>
                <View
                  style={{
                    backgroundColor: getMilestoneStatus(m.nMilestoneStatus)
                      .milestoneColor,
                    marginRight: 12,
                    paddingTop: 1,
                    paddingBottom: 2,
                    paddingRight: 5,
                    paddingLeft: 5,
                    borderRadius: 50,
                  }}>
                  <Label
                    fontSize_12
                    Montserrat_Medium
                    color={getMilestoneStatus(m.nMilestoneStatus).TextColor}>
                    {' '}
                    {getMilestoneStatus(m.nMilestoneStatus).milestoneStatus}
                  </Label>
                </View>
                {this.getInfo(m.nMilestoneStatus) !== '' && (
                  <TouchableOpacity
                    style={{
                      height: 25,
                      position: 'absolute',
                      right: -15,
                      top: 0,
                    }}
                    onPress={() => {
                      let state = this.state;
                      state[`paymentInfo${index}`] = !this.state[
                        `paymentInfo${index}`
                      ];
                      this.setState(state);
                    }}>
                    <ToolTip
                      onClickPress={e => {
                        let state = this.state;
                        state[`paymentInfo${index}`] = !this.state[
                          `paymentInfo${index}`
                        ];
                        this.setState(state);
                        e.stopPropagation(false);
                      }}
                      toolTip={this.state[`paymentInfo${index}`]}
                      title={this.getInfo(m.nMilestoneStatus)}
                      // title={m.nMilestoneStatus == MilestoneStatus.PAYMENT_PROCESSING ? `${Globals.isBuilder ? 'After your client makes the transfer' : 'After you make the transfer'}, ${ErrorMessage.bankUsageWarning}` : ErrorMessage.bankUsagePaidWarning}
                      customTriangle={{
                        left: '78%',
                        backgroundColor: 'red',
                      }}
                      placement="top"
                    />
                  </TouchableOpacity>
                )}
                {/* {m.nMilestoneStatus === MilestoneStatus.COMPLETED && <View
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
                                            style={{ color: Color.WHITE, fontSize: 9 }}
                                        />
                                    </View>
                                </View>} */}
              </View>
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
            <View
              style={{
                flexDirection: 'row',
                paddingBottom: 6,
                flex: 1,
                flexWrap: 'wrap',
              }}>
              <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey}>
                Expected Completion Date:
              </Label>
              <Label Montserrat_Medium fontSize_14 color={Color.BLACK} ml={4}>
                {m.hasOwnProperty('expectedCompletionDate')
                  ? moment(m.expectedCompletionDate).format('DD-MM-YYYY')
                  : '--'}
              </Label>
            </View>
            {/* {m.payment_escrow_detail && m.payment_escrow_detail.mangopayStatus && <View style={{ flexDirection: "row", paddingBottom: 6, flex: 1, flexWrap: 'wrap' }}>
                            <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey} >Payment Status:</Label>
                            <Label Montserrat_Medium fontSize_14 color={Color.DarkBlue} ml={4}>{m.payment_escrow_detail.mangopayStatus}</Label>
                        </View>} */}
            {payment_escrow_detail?.transaction_ref &&
              !payment_escrow_detail.hasOwnProperty('onlineTransferSuccess') &&
              Globals.isClient && (
                <View
                  style={{
                    flexDirection: 'row',
                    paddingBottom: 6,
                    flex: 1,
                    flexWrap: 'wrap',
                  }}>
                  <Label
                    Montserrat_Medium
                    fontSize_14
                    color={Color.DarkGrey}
                    style={{paddingTop: 2}}>
                    Payment Details:{' '}
                  </Label>
                  <Label
                    Montserrat_Medium
                    fontSize_14
                    color={Color.DarkBlue}
                    ml={4}
                    mr={4}
                    style={{paddingTop: 2}}>
                    {'VIEW'}
                  </Label>
                  <ToolTip
                    onClickPress={() => this.showPaymentDetailModal(m)}
                  />
                </View>
              )}
            {Globals.isBuilder &&
              contains(showReviewRequest, m.nMilestoneStatus) &&
              contains(
                [JobStatus.ON_GOING, JobStatus.DORMANT],
                jobDetails.nStatus,
              ) && (
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
                    disabled={reviewRequestDisabled}
                    onPress={() => this.onReviewRequestConfirm(m)}
                    style={[
                      styles.button,
                      {
                        width: '100%',
                        backgroundColor: reviewRequestDisabled
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

            {this.isFailedPayment(m) !== undefined && (
              <View>
                {this.isFailedPayment(m) === true && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <KMButton
                      title={'Retry Payment'}
                      onPress={() => this.onEscrowMilestone(m)}
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
                {this.isFailedPayment(m) === false && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <KMButton
                      title={'Make Payment'}
                      onPress={() => this.onEscrowMilestone(m)}
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
            {/* {(this.isPartialPayment(m) === true && m.nMilestoneNumber !== 1) &&
                            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: 10, }}>
                                <KMButton
                                    disabled={this.state.timerValue > 0}
                                    title={this.state.timerValue <= 0 ? 'Retry Payment' : `Retry Payment in ${this.state.timerValue} seconds`}
                                    onPress={() => this.initiateOnlineTransfer(m)}
                                    style={[styles.button, { width: '100%', backgroundColor: this.state.timerValue <= 0 ? Color.GreyButton : Color.LightBlue, color: Color.WHITE }]} textStyle={{ color: Color.WHITE, fontSize: fontXSmall16, fontFamily: 'Montserrat-Medium' }} />
                            </View>
                        } */}
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
                    onPress={() => this.onApproveMilestone(m, index)}
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
            {Globals.isBuilder &&
              m.payment_status === 4 &&
              m.payment_reminder === false && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <KMButton
                    title={'Prompt Client to Fund Deposit Box'}
                    onPress={() => this.reminderForPayment(m)}
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
          <View style={{marginRight: 0, width: '4%'}}>
            <CustomIcon
              name={'right_arrow'}
              style={{
                fontSize: fontXSmall16,
                color: Color.DarkGrey,
              }}
            />
          </View>
        </TouchableOpacity>
        {!this.state.jobDetails.acceptedMilestoneStatus && Globals.isBuilder && (
          <View style={styles.btnRow}>
            <TouchableOpacity
              onPress={() => this.onDeleteMilestoneConfirm(m)}
              style={{
                width: 113,
                backgroundColor: Color.Red,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Label fontSize_16 Montserrat_Medium color={Color.WHITE}>
                DELETE
              </Label>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigate(Routes.Edit_Milestone, {
                  milestone: m,
                  jobDetails: jobDetails,
                  jobAmount: this.state.jobAmount,
                  milestonePendingAmount: this.state.pendingAmount,
                  milestoneAccepted: jobDetails.nAcceptClientStatus == 0,
                });
              }}
              style={{
                width: 87,
                backgroundColor: Color.LightBlue,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Label fontSize_16 Montserrat_Medium color={Color.WHITE}>
                EDIT
              </Label>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  renderHorizontalView = (item, index) => {
    // console.log('==================================== item');
    // console.log(item);
    // console.log('====================================');

    let statusIndex = this.state.milestones[this.state.currentIndex]
      .nMilestoneStatus;
    let paymentProcessed = !contains([0, 1, 10, 12, 16], statusIndex);
    let paymentInDeposite = !contains(
      [0, 1, 8, 9, 10, 11, 12, 16],
      statusIndex,
    );

    let paymentComeplete = statusIndex === MilestoneStatus.COMPLETED;

    let paymentInDispute = contains([5, 6, 9, 11], statusIndex);

    let mlStatusArr = [
      MilestoneStatus.ON_GOING,
      MilestoneStatus.WORK_REVIEW_REQUEST,
      MilestoneStatus.COMPLETED,
      MilestoneStatus.DISPUTE,
    ];

    return (
      <View style={styles.horizonatalMainView}>
        <View
          style={[
            styles.headerStyle,
            {
              flex: 1,
              justifyContent: 'space-between',
            },
          ]}>
          <Label fontSize_16 Montserrat_Bold color={Color.WHITE}>
            {item.sMilestoneTitle}
          </Label>
          <View
            style={{
              height: 50,
              width: 80,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            {/* {this.state.milestones.length > 0 && contains(mlStatusArr, this.state.milestones[this.state.currentIndex].nMilestoneStatus) &&
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate(Routes.Chat_View, { jobDetails: this.state.jobDetails, milestoneNumber: this.state.milestones[this.state.currentIndex].nMilestoneNumber })
                                }} style={styles.btnEditDelete} >
                                <Image style={{ width: 28, height: 28 }} source={require("./../../../assets/Images/payment/icon_chat.png")} />
                            </TouchableOpacity>} */}

            {this.state.canEdit &&
              Globals.isBuilder && (
                <TouchableOpacity
                  onPress={() => {
                    this.onDeleteMilestoneConfirm(
                      this.state.milestones[this.state.currentIndex],
                    );
                  }}
                  style={styles.btnEditDelete}>
                  <Image
                    source={require('./../../../assets/Images/payment/icon_delete.png')}
                  />
                </TouchableOpacity>
              )}

            {this.state.canEdit && Globals.isBuilder && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate(Routes.Edit_Milestone, {
                    milestone: this.state.milestones[this.state.currentIndex],
                    jobDetails: this.state.jobDetails,
                    jobAmount: this.state.jobAmount,
                    milestonePendingAmount: this.state.pendingAmount,
                    milestoneAccepted:
                      this.state.jobDetails.nAcceptClientStatus == 0,
                  });
                }}
                style={styles.btnEditDelete}>
                <Image
                  source={require('./../../../assets/Images/payment/icon_edit.png')}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {console.log('=== paymentProcessed', paymentProcessed)}

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 15,
          }}>
          <Image
            source={
              !paymentProcessed
                ? require('./../../../assets/Images/payment/process-inactive.png')
                : require('./../../../assets/Images/payment/payment_processed.png')
            }
          />
          {/* <Label
            mt={20}
            mb={5}
            fontSize_16
            color={!paymentProcessed ? Color.DarkGrey : Color.DarkBlue}
            Montserrat_Medium>
            {statusIndex == 8 ? 'Processing Deposit' : 'Payment Processed'}
          </Label> */}
          
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 20,
              marginBottom: 5
            }}>
            <Label
              fontSize_16              
              mr={2}
              color={!paymentProcessed ? Color.DarkGrey : Color.DarkBlue}
              Montserrat_Medium>
              {statusIndex == 8 ? 'Processing Deposit' : 'Payment Processed'}
            </Label>
            {statusIndex == 8 && 
            <ToolTip    
              onClickPress={e => {
                let state = this.state;
                state.processingDepositToolTip = !this.state.processingDepositToolTip;
                this.setState(state);
                e.stopPropagation(false);
              }}
              toolTip={this.state.processingDepositToolTip}
              title={'Pay-ins are processed after 4:00pm each day Monday-Friday'}
              placement="top"
              customIcon={{
                color: Color.DarkBlue,
                fontSize: fontNormal20,
                marginTop: 1,
              }}
            />}
          </View>
          
          <Image
            style={{
              margin: 15,
              tintColor: !paymentProcessed ? Color.DarkGrey : Color.DarkBlue,
            }}
            source={require('./../../../assets/Images/payment/arrow_down.png')}
          />
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
          }}>
          <Image
            source={
              paymentInDeposite
                ? require('./../../../assets/Images/payment/process-active.png')
                : require('./../../../assets/Images/payment/deposit_inactive.png')
            }
          />
          <Label
            mt={20}
            mb={5}
            fontSize_16
            color={paymentInDeposite ? Color.DarkBlue : Color.DarkGrey}
            Montserrat_Medium>
            Payment In Deposit Box
          </Label>
          <Image
            style={{
              margin: 15,
              tintColor: paymentInDeposite ? Color.DarkBlue : Color.DarkGrey,
            }}
            source={require('./../../../assets/Images/payment/arrow_down.png')}
          />
        </View>

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 15,
          }}>
          <Image
            source={
              paymentComeplete
                ? require('./../../../assets/Images/payment/icon_active.png')
                : paymentInDispute
                  ? require('./../../../assets/Images/payment/dispute.png')
                  : require('./../../../assets/Images/payment/icon_inactive.png')
            }
          />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 20,
              marginBottom: 5
            }}>
            <Label
            mr={2}
            fontSize_16
            color={
              paymentComeplete
                ? Color.DarkBlue
                : paymentInDispute
                  ? Color.Red
                  : Color.DarkGrey
            }
            Montserrat_Medium>
            {paymentComeplete
              ? 'Payment Stage Completed'
              : paymentInDispute
                ? getMilestoneStatus(
                  this.state.milestones[this.state.currentIndex]
                    .nMilestoneStatus,
                ).milestoneStatus ===
                  'Payment Rejected. Please Contact Us On 01334 806113.'
                  ? 'Payment Rejected'
                  : getMilestoneStatus(
                    this.state.milestones[this.state.currentIndex]
                      .nMilestoneStatus,
                  ).milestoneStatus
                : 'Payment Stage Completed'}
          </Label>
            {paymentComeplete && 
            <ToolTip         
              onClickPress={e => {
                let state = this.state;
                state.paymentCompleteToolTip = !this.state.paymentCompleteToolTip;
                this.setState(state);
                e.stopPropagation(false);
              }}
              toolTip={this.state.paymentCompleteToolTip}
              title={'Pay-outs are processed at 10:30am and 3:30pm Monday-Friday'}
              placement="top"
              customIcon={{
                color: Color.DarkBlue,
                fontSize: fontNormal20,
                marginTop: 1,
              }}
            />}
            {getMilestoneStatus(
                    this.state.milestones[this.state.currentIndex]
                      .nMilestoneStatus,
                  ).milestoneStatus === 'Client Card Payment Failed' && 
            <ToolTip         
              onClickPress={e => {
                let state = this.state;
                state.paymentCompleteToolTip = !this.state.paymentCompleteToolTip;
                this.setState(state);
                e.stopPropagation(false);
              }}
              toolTip={this.state.paymentCompleteToolTip}
              title={'Your client has tried initializing a card payment but failed. Waiting for client to retry.'}
              placement="top"
              customIcon={{
                color: Color.DarkBlue,
                fontSize: fontNormal20,
                marginTop: 1,
              }}
            />}
          </View>
        </View>
      </View>
    );
  };

  renderCancelJobView() {
    let {jobDetails} = this.state;
    let statusArr = [
      JobStatus.ON_GOING,
      // JobStatus.REJECTED,
      JobStatus.CANCELLATION_REQUEST_ACCEPTED,
      JobStatus.CANCELLATION_REQUEST_BY_BUILDER,
      JobStatus.CANCELLATION_REQUEST_BY_CLIENT,
    ];
    let deleteStatusArr = [
      JobStatus.PENDING,
      JobStatus.REQUESTED,
      JobStatus.AWAITING_RESPONSE,
    ];
    // if (contains(deleteStatusArr, jobDetails.nStatus) && jobDetails.oCreatedBy === this.state.user._id) {
    //     return (
    //         <View>
    //             <TouchableOpacity onPress={() => {
    //                 this.setState({
    //                     showConfirm: true,
    //                     confirmMsg: 'Are you sure you want to delete this job?',
    //                     confirmFnc: () => this.onDeleteJob(jobDetails._id, 1),
    //                     hideFnc: () => this.setState({ showConfirm: false })
    //                 })
    //             }} style={{ marginTop: 20, }}>
    //                 <Label fontSize_16 color={Color.Red} Montserrat_Medium>Delete Job</Label>
    //             </TouchableOpacity>
    //         </View >
    //     )
    // }

    if (contains(statusArr, jobDetails.nStatus)) {
      if (!jobDetails.bCancelRequestArrived) {
        return (
          <View>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  showConfirm: true,
                  confirmMsg: 'Are you sure you want to cancel this job?',
                  confirmFnc: () => this.onCancelJob(jobDetails._id, 1),
                  hideFnc: () =>
                    this.setState({
                      showConfirm: false,
                    }),
                });
              }}>
              <Label fontSize_16 color={Color.Red} Montserrat_Medium>
                Cancel Job
              </Label>
            </TouchableOpacity>
          </View>
        );
      } else if (
        (Globals.isBuilder &&
          contains([1, 2], jobDetails.nCancellationRequestAcceptByBuilder)) ||
        (!Globals.isBuilder &&
          contains([1, 2], jobDetails.nCancellationRequestAcceptByClient))
      ) {
        return null;
      } else {
        return (
          <View>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  showConfirm: true,
                  confirmMsg: 'Are you sure you want to cancel this job?',
                  confirmFnc: () => this.onCancelJob(jobDetails._id, 1),
                  hideFnc: () =>
                    this.setState({
                      showConfirm: false,
                    }),
                })
              }>
              <Label mt={10} fontSize_16 color={Color.Red} Montserrat_Medium>
                Accept cancellation request
              </Label>
            </TouchableOpacity>
          </View>
        );
      }
    }
  }

  getTimerInfo() {
    let {milestones} = this.state;
    let timerString = '';
    milestones.forEach(m => {
      if (
        parseInt(m.nMilestoneStatus) === MilestoneStatus.WORK_REVIEW_REQUEST
      ) {
        // timerString = `${timer(m.dReviewRequestAt, 30)} to respond`
        let payoutDate = nextPayoutDateTime(m.dReviewRequestAt);
        timerString = `${dateDiff(payoutDate)} to respond`;
      }
    });
    return timerString === '' ? undefined : timerString;
  }

  hasChangeRequest = () => {
    let {jobDetails} = this.state;
    return jobDetails.nStatus === JobStatus.MODIFICATION_REQUESTED;
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

  onRaiseDisputeWebService = async () => {
    this.setState({
      isLoading: true,
      showConfirm: false,
    });
    let milestone = this.state.milestones[this.state.currentIndex];
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

  renderNextPrevView = () => {
    const {currentIndex} = this.state;
    return (
      <View style={styles.bottomNextPrevious}>
        <TouchableOpacity
          style={{
            width: 100,
            height: 30,
            justifyContent: 'center',
            borderColor:
              currentIndex !== 0 ? Color.DarkBlue : Color.TRANSPARENT,
            borderWidth: currentIndex !== 0 ? 1 : 0,
            alignItems: 'center',
            borderRadius: 8,
          }}
          onPress={() => {
            if (currentIndex !== 0) {
              this.scrollview_ref.scrollTo({
                x: width * (currentIndex - 1),
                y: 0,
                animated: true,
              });
              this.setState({
                currentIndex: currentIndex - 1,
              });
            }
          }}>
          {currentIndex !== 0 && (
            <Label color={Color.DarkBlue} Montserrat_Medium fontSize_16>
              Previous
            </Label>
          )}
        </TouchableOpacity>

        <PageControl
          style={{alignSelf: 'center'}}
          numberOfPages={this.state.milestones.length}
          currentPage={currentIndex}
          hidesForSinglePage
          pageIndicatorTintColor="#C4C4C4"
          currentPageIndicatorTintColor={Color.DarkBlue}
          indicatorStyle={{borderRadius: 5}}
          currentIndicatorStyle={{
            borderRadius: 5,
          }}
          indicatorSize={{width: 8, height: 8}}
        // onPageIndicatorPress={this.onItemTap}
        />

        <TouchableOpacity
          style={{
            width: 100,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor:
              currentIndex !== this.state.milestones.length - 1
                ? Color.DarkBlue
                : Color.TRANSPARENT,
            borderWidth:
              currentIndex !== this.state.milestones.length - 1 ? 1 : 0,
            borderRadius: 8,
          }}
          onPress={() => {
            if (currentIndex !== this.state.milestones.length - 1) {
              this.scrollview_ref.scrollTo({
                x: width * (currentIndex + 1),
                y: 0,
                animated: true,
              });
              this.setState({
                currentIndex: currentIndex + 1,
              });
            }
          }}>
          {currentIndex !== this.state.milestones.length - 1 && (
            <Label color={Color.DarkBlue} Montserrat_Medium fontSize_16>
              Next
            </Label>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // BG
  getPaymentStatus = milestones => {
    let status = '';
    const currentMilestone = milestones[this.state.currentIndex];
    if (currentMilestone.isLastMilestone) {
      status = getMilestoneStatus(currentMilestone.nMilestoneStatus)
        .milestoneStatus;
      status = status.split('.')[0];
      status = status.replace(
        ' X ',
        ' ' + currentMilestone.sMilestoneTitle + ' ',
      );
    } else {
      const nextMilestone = milestones[this.state.currentIndex + 1];
      if (nextMilestone?.nMilestoneStatus == MilestoneStatus.COMPLETED) {
        status = getMilestoneStatus(currentMilestone.nMilestoneStatus)
          .milestoneStatus;
        status = status.split('.')[0];
        status = status.replace(
          ' X ',
          ' ' + currentMilestone.sMilestoneTitle + ' ',
        );
        status = status + '.';
      } else {
        status = getMilestoneStatus(currentMilestone.nMilestoneStatus)
          .milestoneStatus;
        status = status.replace(
          ' X ',
          ' ' + currentMilestone.sMilestoneTitle + ' ',
        );
        status = status.replace(' Z', ' ' + nextMilestone?.sMilestoneTitle);
      }
    }

    // if(Globals.isBuilder && status === "Ready To Submit"){
    //     status = "Ready For Client Approval"
    // }

    // if(!Globals.isBuilder && status === "Ready To Submit"){
    //     status = "Waiting For Your Approval"
    // }

    // if(!Globals.isBuilder && status === "Waiting For Client To Fund Deposit Box"){
    //     status = "Waiting For You To Fund Deposit Box"
    // }

    // if(!Globals.isBuilder && status === "The Client Has An Issue With The Work"){
    //     status = "Issue Raised"
    // }

    return status;
  };

  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this.getJobDetails();
      },
    );
  };
  // BG

  render() {
    const {navigate} = this.props.navigation;
    const {
      bankwireModal,
      milestoneAmount,
      milestoneStatus,
      isJobAccepted,
      milestoneTitle,
      paymentDetails,
      openUrl,
      paymentProceesing,
      paymentStatus,
      failedMessage,
      isLoading,
      jobDetails,
      milestones,
      bottomButtonType,
      toast,
      jobCount,
      acceptMilestonesStatus,
      payment_reminder,
      refreshing,
    } = this.state;
    // console.log(this.state.payment_reminder, "payment_reminder");

    let completedML = milestones.filter(m => {
      return parseInt(m.nMilestoneStatus) === MilestoneStatus.COMPLETED;
    });

    let paymentDueTime = this.getTimerInfo();
    let showAccept =
      !Globals.isBuilder && jobDetails?.nStatus === JobStatus.AWAITING_RESPONSE;
    let milestoneTotal = 0;
    milestones.forEach(m => {
      milestoneTotal = milestoneTotal + m.nMilestoneAmount;
    });
    milestoneTotal = Number(milestoneTotal.toFixed(2))
    let userVerified = this.props.screenProps?.isVerified;

    // console.log("=========<<<<<<<<", jobDetails);


    let kycComplete = jobDetails && jobDetails.Builder && jobDetails.Builder.kyc_status && jobDetails.Builder.kyc_status.identity_proof && jobDetails.Builder.kyc_status.identity_proof === "VALIDATED" || false;



    let payment_escrow_detail =
      milestones[this.state.currentIndex]?.payment_escrow_detail;
    let showPaymentReminder = Globals.isClient
      ? payment_reminder.length !== 0
      : false;
    // let jobProgress = getValidNumber(completedML.length / milestones.length)

    const mangopayStatus = payment_escrow_detail?.mangopayStatus == 'Succeeded';

    return (
      <View style={styles.container}>
        {/* <FilterDropdown /> */}
        <SafeAreaView style={styles.safeVStyle}>
          {showPaymentReminder && (
            <View
              View
              style={{
                zIndex: 99,
                backgroundColor: '#FAF8ED',
                position: 'absolute',
                top: 10,
                width: '100%',
                paddingVertical: 8,
              }}>
              <Label
                style={{
                  width: '100%',
                  textAlign: 'center',
                }}
                color={Color.BLACK}
                fontSize_16
                Montserrat_Medium>{`A Builder has requested payment for Payment Stage ${payment_reminder[0]?.sMilestoneTitle
                  }`}</Label>
            </View>
          )}
          {/* <KeyboardAwareScrollView> */}
          <KeyboardAwareScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.onRefresh}
              />
            }>
            {Object.keys(jobDetails).length > 0 && (
              <View
                style={[
                  styles.boxPadding,
                  {
                    paddingTop: showPaymentReminder ? '20%' : 16,
                    borderBottomWidth: 0,
                    paddingBottom: 0,
                  },
                ]}>
                <Collapse
                  isExpanded={this.state.expanded}
                  onToggle={isExpanded =>
                    this.setState({
                      expanded: isExpanded,
                    })
                  }>
                  <CollapseHeader
                    style={[
                      styles.headerStyle,
                      {
                        flex: 1,
                        justifyContent: 'space-between',
                        backgroundColor: jobDetails.nStatus == 5 ? Color.Red : Color.LightBlue
                      },
                    ]}>
                    <Label fontSize_16 Montserrat_Bold color={Color.WHITE}>
                      {jobDetails.sJobTitle}
                    </Label>
                    <Image
                      source={
                        this.state.expanded
                          ? require('./../../../assets/Images/payment/icon_up.png')
                          : require('./../../../assets/Images/payment/icon_down.png')
                      }
                    />
                  </CollapseHeader>
                </Collapse>
              </View>
            )}

            {Object.keys(jobDetails).length > 0 && this.state.expanded && (
              <View
                style={[
                  {
                    borderBottomWidth: 0,
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingBottom: 0,
                  },
                ]}>
                <CollapseBody
                  style={{
                    marginTop: 5,
                    width: '100%',
                    backgroundColor: Color.bgBlue,
                  }}>
                  <View style={styles.rowView}>
                    <Label
                      fontSize_14
                      Montserrat_Medium
                      color={Color.DarkGrey}
                      style={{lineHeight: 20}}>
                      Total Job Amount:
                    </Label>
                    {isValidIntValue(jobDetails.nJobAmount) ? (
                      <Label
                        fontSize_14
                        Montserrat_Medium
                        color={Color.BLACK}
                        ml={5}
                        style={{
                          lineHeight: 20,
                        }}>
                        {'£ ' + jobDetails.nJobAmount}
                      </Label>
                    ) : (
                      <Label
                        fontSize_14
                        Montserrat_Medium
                        color={Color.BLACK}
                        ml={5}
                        style={{
                          lineHeight: 20,
                        }}>
                        -
                      </Label>
                    )}
                  </View>

                  {Globals.isBuilder && (
                    <View style={styles.rowView}>
                      <Label
                        fontSize_14
                        Montserrat_Medium
                        color={Color.DarkGrey}
                        style={{
                          lineHeight: 20,
                        }}>
                        Service Fee:
                      </Label>
                      {isValidIntValue(jobDetails.nAdminComission) ? (
                        <Label
                          fontSize_14
                          Montserrat_Medium
                          color={Color.BLACK}
                          ml={5}
                          style={{
                            lineHeight: 20,
                          }}>
                          {'£ ' + jobDetails.nAdminComission}
                        </Label>
                      ) : (
                        <Label
                          fontSize_14
                          Montserrat_Medium
                          color={Color.BLACK}
                          ml={5}
                          style={{
                            lineHeight: 20,
                          }}>
                          -
                        </Label>
                      )}
                    </View>
                  )}
                  {isValidIntValue(jobDetails.nPropertyManagerComission) &&
                    Globals.isBuilder &&
                    jobDetails.nPropertyManagerComission > 0 && (
                      <View style={styles.rowView}>
                        <Label
                          fontSize_14
                          Montserrat_Medium
                          color={Color.DarkGrey}
                          style={{
                            lineHeight: 20,
                          }}>
                          Property Manager Commission:
                        </Label>
                        <Label
                          fontSize_14
                          Montserrat_Medium
                          color={Color.BLACK}
                          ml={5}
                          style={{
                            lineHeight: 20,
                          }}>
                          {'£ ' + jobDetails.nPropertyManagerComission}
                        </Label>
                      </View>
                    )}
                  {Globals.isBuilder && (
                    <View style={styles.rowView}>
                      <Label
                        fontSize_14
                        Montserrat_Medium
                        color={Color.DarkGrey}
                        style={{
                          lineHeight: 20,
                        }}>
                        Amount You'll receive:
                      </Label>
                      {/* <Label fontSize_14 Montserrat_Medium color={Color.BLACK} ml={5} style={{ lineHeight: 20 }}>NA</Label> */}
                      {isValidIntValue(jobDetails.nJobBuilderAmount) ? (
                        <Label
                          fontSize_14
                          Montserrat_Medium
                          color={Color.BLACK}
                          ml={5}
                          style={{
                            lineHeight: 20,
                          }}>
                          {'£ ' + jobDetails.nJobBuilderAmount}
                        </Label>
                      ) : (
                        <Label
                          fontSize_14
                          Montserrat_Medium
                          color={Color.BLACK}
                          ml={5}
                          style={{
                            lineHeight: 20,
                          }}>
                          -
                        </Label>
                      )}
                    </View>
                  )}
                  {paymentDueTime && (
                    <View style={styles.rowView}>
                      <Label
                        Montserrat_Medium
                        fontSize_14
                        color={Color.DarkGrey}>
                        Payment Requested:{' '}
                      </Label>
                      <Label
                        Montserrat_Medium
                        fontSize_14
                        color={Color.BLACK}
                        ml={4}>
                        {paymentDueTime}
                      </Label>
                    </View>
                  )}

                  <Label
                    style={{padding: 10}}
                    Montserrat_Medium
                    fontSize_14
                    color={Color.DarkGrey}>
                    Job Description:{' '}
                  </Label>
                  {!!jobDetails.sJobDescription && (
                    <Label
                      ml={10}
                      Montserrat_Medium
                      fontSize_14
                      color={Color.BLACK}>
                      {jobDetails.sJobDescription}
                    </Label>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      padding: 10,
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          backgroundColor: getJobStatus(jobDetails.nStatus)[1],
                          marginRight: 10,
                          paddingLeft: 10,
                          paddingTop: 3,
                          paddingBottom: 3,
                          paddingRight: 10,
                          borderRadius: 50,
                        }}>
                        <Label
                          fontSize_12
                          Montserrat_Medium
                          color={Color.WHITE}>
                          {getJobStatus(jobDetails.nStatus)[0]}
                        </Label>
                      </View>
                      {jobDetails.nStatus === JobStatus.COMPLETED ? (
                        <View
                          style={{
                            width: 18,
                            height: 18,
                            backgroundColor: getJobStatus(
                              jobDetails.nStatus,
                            )[1],
                            borderRadius: 9,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <CustomIcon
                            name="check"
                            style={{
                              color: Color.WHITE,
                              fontSize: 9,
                            }}
                          />
                        </View>
                      ) : null}
                    </View>
                    {this.renderCancelJobView()}
                  </View>
                </CollapseBody>
              </View>
            )}

            {Object.keys(jobDetails).length > 0 && (
              <View style={[styles.boxPadding, {paddingTop: 0}]}>
                <View
                  style={{
                    marginTop: 5,
                    width: '100%',
                    backgroundColor: Color.bgBlue,
                  }}>
                  {Globals.isBuilder &&
                    isValidValue(jobDetails.Client) &&
                    !jobDetails.registeredClient ? (
                    <View
                      style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                        paddingTop: 24,
                        borderBottomColor: Color.WhiteGrey,
                      }}>
                      <UserDetails client={jobDetails.Client} title="Client" />
                    </View>
                  ) : (
                    <View
                      style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                        paddingTop: 24,
                        borderBottomColor: Color.WhiteGrey,
                      }}>
                      <UserDetails
                        client={jobDetails.Builder}
                        title="Tradesperson"
                      />
                    </View>
                  )}
                  {isValidValue(jobDetails.PropertyManager) && (
                    <View
                      style={{
                        paddingLeft: 16,
                        paddingRight: 16,
                        paddingTop: 24,
                      }}>
                      <UserDetails
                        client={jobDetails.PropertyManager}
                        title="Property Manager"
                      />
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* {Globals.isBuilder && isValidValue(jobDetails.Client) && !jobDetails.registeredClient ?
                            <View style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 24, borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey }}>
                                <UserDetails client={jobDetails.Client} title="Client" />
                            </View>
                            :
                            <View style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 24, borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey }}>
                                <UserDetails client={jobDetails.Builder} title="Tradesperson" />
                            </View>
                        }
                        {isValidValue(jobDetails.PropertyManager) &&
                            <View style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 24, }}>
                                <UserDetails client={jobDetails.PropertyManager} title="Property Manager" />
                            </View>
                        } */}
            {Object.keys(jobDetails).length > 0 && (
              <View style={{paddingBottom: 16}}>
                {/* <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} style={{ paddingBottom: 90, paddingTop: 90, }}>Contract not created yet</Label>
                            <View style={{ paddingRight: 16, paddingLeft: 16, paddingBottom: 16, paddingTop: 16, borderBottomWidth: 1, borderBottomColor: Color.WhiteGrey, }}>
                                <Label fontSize_14 Montserrat_Bold mb={4}>Contract Description:</Label>
                                <ViewMoreText
                                    numberOfLines={3}
                                    renderViewMore={this.renderViewMore}
                                    renderViewLess={this.renderViewLess}
                                    textStyle={{}}
                                >
                                    <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey} style={{ lineHeight: 20, }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                     Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                                    </Label>
                                </ViewMoreText>
                            </View> */}
                {/* {(bottomButtonType != 1 && !Globals.isBuilder) && <View style={{ paddingRight: 16, paddingLeft: 16, paddingTop: 16, paddingBottom: 16 }}>
                                <Label fontSize_14 Montserrat_Bold mb={18}>List of Milestones</Label>
                                
                                {jobDetails.ActiveMilestone && Object.keys(jobDetails.ActiveMilestone).length > 0 &&
                                    <StageDetails data={jobDetails.ActiveMilestone} />
                                    }
                            </View>} */}

                {(Globals.isBuilder
                  ? bottomButtonType != bottomButton.ACCEPT_JOB
                  : jobCount > 1) && (
                    <View
                      style={{
                        paddingRight: 16,
                        paddingLeft: 16,
                        paddingTop: 24,
                        borderBottomWidth: 1,
                        borderBottomColor: Color.WhiteGrey,
                        flexDirection: 'row',
                        zIndex: 11,
                      }}>
                      <Label fontSize_14 Montserrat_Bold mb={18}>
                        Payment Stages Breakdown
                      </Label>
                      {showAccept && Globals.isBuilder && (
                        <ToolTip
                          onClickPress={this.handleClick}
                          toolTip={this.state.toolTip}
                          title={'Add one or more payment stages for your job'}
                        />
                      )}
                    </View>
                  )}

                {milestones.length > 0 && (
                  <Label
                    mt={15}
                    ml={16}
                    mr={16}
                    mb={15}
                    Montserrat_Medium
                    fontSize_16
                    color={Color.BLACK}>{`Payment Stage ${milestones[this.state.currentIndex].nMilestoneNumber
                      }`}</Label>
                )}

                <ScrollView
                  style={{marginBottom: 20}}
                  ref={ref => {
                    this.scrollview_ref = ref;
                  }}
                  onMomentumScrollEnd={this._onMomentumScrollEnd}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  pagingEnabled>
                  {milestones.map((item, index) => {
                    return this.renderHorizontalView(item, index);
                  })}
                </ScrollView>

                {/* Page control and next previous */}

                {milestones.length > 1 && this.renderNextPrevView()}

                {/* Details pf  Payment */}

                <View
                  style={{
                    marginBottom: 10,
                    width: width - 32,
                    paddingVertical: 10,
                    backgroundColor: Color.bgBlue,
                    alignSelf: 'center',
                  }}>
                  <View
                    style={[
                      styles.rowView,
                      {
                        flex: 1,
                        // flexWrap: 'wrap',
                        alignItems: 'flex-start',
                      },
                    ]}>
                    <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey}>
                      Status:{' '}
                    </Label>
                    {milestones.length > 0 && (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                        }}>
                        {this.getInfo(
                          milestones[this.state.currentIndex].nMilestoneStatus,
                        ) !== '' && (
                            <TouchableOpacity
                              style={
                                {
                                  /*height: 25, top: 0*/
                                }
                              }
                              onPress={() => {
                                let state = this.state;
                                state[
                                  `paymentInfo${this.state.currentIndex}`
                                ] = !this.state[
                                `paymentInfo${this.state.currentIndex}`
                                ];
                                this.setState(state);
                              }}>
                              <ToolTip
                                onClickPress={e => {
                                  let state = this.state;
                                  state[
                                    `paymentInfo${this.state.currentIndex}`
                                  ] = !this.state[
                                  `paymentInfo${this.state.currentIndex}`
                                  ];
                                  this.setState(state);
                                  e.stopPropagation(false);
                                }}
                                toolTip={
                                  this.state[
                                  `paymentInfo${this.state.currentIndex}`
                                  ]
                                }
                                title={this.getInfo(milestones[this.state.currentIndex].nMilestoneStatus,)}
                                // title={m.nMilestoneStatus == MilestoneStatus.PAYMENT_PROCESSING ? `${Globals.isBuilder ? 'After your client makes the transfer' : 'After you make the transfer'}, ${ErrorMessage.bankUsageWarning}` : ErrorMessage.bankUsagePaidWarning}
                                customTriangle={{
                                  left: '78%',
                                  backgroundColor: 'red',
                                }}
                                customIcon={{
                                  color: Color.DarkBlue,
                                  fontSize: fontNormal20,
                                  marginRight: 3,
                                  marginTop: 0,
                                }}
                                placement="top"
                              />
                            </TouchableOpacity>
                          )}
                        <Label
                          Montserrat_Medium
                          fontSize_14
                          color={Color.BLACK}
                          style={{
                            textAlign: 'right',
                            flex: 1,
                          }}>
                          {this.getPaymentStatus(milestones)}
                        </Label>
                      </View>
                    )}

                    {milestones.length === 0 && (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          paddingLeft: 10,
                          justifyContent: 'flex-end',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            let state = this.state;
                            state[
                              `paymentInfo${this.state.currentIndex}`
                            ] = !this.state[
                            `paymentInfo${this.state.currentIndex}`
                            ];
                            this.setState(state);
                          }}>
                          <ToolTip
                            onClickPress={e => {
                              let state = this.state;
                              state[
                                `paymentInfo${this.state.currentIndex}`
                              ] = !this.state[
                              `paymentInfo${this.state.currentIndex}`
                              ];
                              this.setState(state);
                              e.stopPropagation(false);
                            }}
                            toolTip={
                              this.state[
                              `paymentInfo${this.state.currentIndex}`
                              ]
                            }
                            title="Please make sure that your payment stages add up to the total job amount. "
                            // title={this.getInfo(milestones[this.state.currentIndex].nMilestoneStatus)}
                            // title={m.nMilestoneStatus == MilestoneStatus.PAYMENT_PROCESSING ? `${Globals.isBuilder ? 'After your client makes the transfer' : 'After you make the transfer'}, ${ErrorMessage.bankUsageWarning}` : ErrorMessage.bankUsagePaidWarning}
                            customTriangle={{
                              left: '78%',
                              backgroundColor: 'red',
                            }}
                            customIcon={{
                              color: Color.DarkBlue,
                              fontSize: fontNormal20,
                              marginRight: 3,
                              marginTop: -2,
                            }}
                            placement="top"
                          />
                        </TouchableOpacity>

                        <Label
                          Montserrat_Medium
                          fontSize_14
                          color={Color.BLACK}
                          style={{
                            textAlign: 'right',
                          }}>
                          {'Incomplete Payment Stages'}
                        </Label>
                      </View>
                    )}
                  </View>

                  <View style={styles.rowView}>
                    <Label Montserrat_Medium fontSize_14 color={Color.DarkGrey}>
                      Payment Stage Amount:{' '}
                    </Label>
                    {milestones.length > 0 ? (
                      <Label
                        Montserrat_Medium
                        fontSize_14
                        color={Color.BLACK}
                        ml={4}>
                        £{' '}
                        {milestones[
                          this.state.currentIndex
                        ].nMilestoneAmount.toFixed(2)}
                      </Label>
                    ) : (
                      <Label
                        Montserrat_Medium
                        fontSize_14
                        color={Color.BLACK}
                        ml={4}>
                        {'-'}
                      </Label>
                    )}
                  </View>

                  {Globals.isBuilder && (
                    <View style={styles.rowView}>
                      <Label
                        Montserrat_Medium
                        fontSize_14
                        color={Color.DarkGrey}>
                        Service Fee:{' '}
                      </Label>
                      {milestones.length > 0 ? (
                        <Label
                          fontSize_14
                          Montserrat_Medium
                          color={Color.BLACK}
                          ml={5}>
                          £{' '}
                          {milestones[
                            this.state.currentIndex
                          ].nAdminComission?.toFixed(2)}
                        </Label>
                      ) : (
                        <Label
                          fontSize_14
                          Montserrat_Medium
                          color={Color.BLACK}
                          ml={5}>
                          {'-'}
                        </Label>
                      )}
                    </View>
                  )}

                  {Globals.isBuilder &&
                    milestones.length > 0 &&
                    milestones[this.state.currentIndex]
                      .nPropertyManagerComission > 0 && (
                      <View style={styles.rowView}>
                        <Label
                          fontSize_14
                          Montserrat_Medium
                          color={Color.DarkGrey}>
                          Property Manager Comission:
                        </Label>
                        <Label
                          fontSize_14
                          Montserrat_Medium
                          color={Color.BLACK}
                          ml={5}>
                          £{' '}
                          {
                            milestones[this.state.currentIndex]
                              .nPropertyManagerComission
                          }
                        </Label>
                      </View>
                    )}

                  <View style={styles.rowView}>
                    <Label fontSize_14 Montserrat_Medium color={Color.DarkGrey}>
                      Paid Amount:
                    </Label>
                    {milestones.length > 0 ? (
                      <Label
                        fontSize_14
                        Montserrat_Medium
                        color={Color.BLACK}
                        ml={5}>
                        £{' '}
                        {milestones[
                          this.state.currentIndex
                        ].nMilestoneAmount.toFixed(2)}
                      </Label>
                    ) : (
                      <Label
                        fontSize_14
                        Montserrat_Medium
                        color={Color.BLACK}
                        ml={5}>
                        {'-'}
                      </Label>
                    )}
                  </View>

                  {payment_escrow_detail?.transaction_ref &&
                    !payment_escrow_detail.hasOwnProperty(
                      'onlineTransferSuccess',
                    ) &&
                    Globals.isClient && (
                      <View style={styles.rowView}>
                        <Label
                          Montserrat_Medium
                          fontSize_14
                          color={Color.DarkGrey}
                          style={{paddingTop: 2}}>
                          Payment Details:{' '}
                        </Label>
                        <TouchableOpacity
                          onPress={() =>
                            this.showPaymentDetailModal(
                              milestones[this.state.currentIndex],
                            )
                          }
                          style={{
                            backgroundColor: Color.DarkBlue,
                            borderRadius: 50,
                            // padding: 4,
                            paddingVertical: 4,
                            paddingHorizontal: 10,
                            marginLeft: 5,
                          }}>
                          <Label
                            fontSize_12
                            Montserrat_Medium
                            color={Color.WHITE}>
                            {'VIEW'}
                          </Label>
                        </TouchableOpacity>
                        {/* <Label Montserrat_Medium fontSize_14 color={Color.DarkBlue} ml={4} mr={4} style={{ paddingTop: 2 }}>{payment_escrow_detail?.transaction_ref}</Label> */}
                        {/* <ToolTip onClickPress={() => this.showPaymentDetailModal(milestones[this.state.currentIndex])} /> */}
                      </View>
                    )}

                  {milestones.length > 0 &&
                    !!milestones[this.state.currentIndex].sMilestoneDesc && (
                      <View>
                        <Label
                          style={{
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                          }}
                          Montserrat_Medium
                          fontSize_14
                          color={Color.DarkGrey}>
                          Payment Stage Description:{' '}
                        </Label>
                        <Label
                          ml={10}
                          mr={10}
                          Montserrat_Medium
                          fontSize_14
                          color={Color.BLACK}>
                          {milestones[this.state.currentIndex].sMilestoneDesc ||
                            '--'}
                        </Label>
                      </View>
                    )}
                </View>

                {/* Button for request and other */}

                {Globals.isBuilder &&
                  mangopayStatus &&
                  milestones.length > 0 &&
                  contains(
                    showReviewRequest,
                    milestones[this.state.currentIndex].nMilestoneStatus,
                  ) &&
                  contains(
                    [JobStatus.ON_GOING, JobStatus.FURTHER_ACTION],
                    jobDetails.nStatus,
                  ) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <KMButton
                        title={
                          milestones[this.state.currentIndex]
                            .nMilestoneStatus ===
                            MilestoneStatus.WORK_REVIEW_REQUEST ||
                            milestones[this.state.currentIndex]
                              .nMilestoneStatus === MilestoneStatus.DISPUTE
                            ? 'Payment Requested'
                            : 'Request Payment'
                        }
                        disabled={
                          milestones[this.state.currentIndex]
                            .nMilestoneStatus ===
                          MilestoneStatus.WORK_REVIEW_REQUEST ||
                          milestones[this.state.currentIndex]
                            .nMilestoneStatus === MilestoneStatus.DISPUTE ||
                          !userVerified || !kycComplete
                        }
                        onPress={() =>
                          this.onReviewRequest(
                            milestones[this.state.currentIndex],
                          )
                        }
                        textStyle={{
                          color: Color.WHITE,
                          fontSize: fontXSmall16,
                          fontFamily: 'Montserrat-Medium',
                        }}
                        style={[
                          styles.button,
                          {
                            width: width - 32,
                            marginLeft: 16,
                            alignSelf: 'center',
                            backgroundColor:
                              milestones[this.state.currentIndex]
                                .nMilestoneStatus ===
                                MilestoneStatus.WORK_REVIEW_REQUEST ||
                                milestones[this.state.currentIndex]
                                  .nMilestoneStatus === MilestoneStatus.DISPUTE ||
                                !userVerified || !kycComplete
                                ? Color.GreyButton
                                : Color.LightBlue,
                            color: Color.WHITE,
                          },
                        ]}
                      />
                    </View>
                  )
                }

                {milestones.length > 0 &&
                  milestones[this.state.currentIndex].DisputeMilestone.length >
                  0 &&
                  milestones[
                    this.state.currentIndex
                  ].DisputeMilestone[0].hasOwnProperty('nResultStatus') && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <KMButton
                        fontSize_16
                        Montserrat_Medium
                        color={Color.BLACK}
                        title="CONCLUSION"
                        style={[
                          styles.button,
                          {
                            width: width - 32,
                            marginLeft: 16,
                            alignSelf: 'center',
                            backgroundColor: Color.Yellow,
                          },
                        ]}
                        textStyle={{
                          color: Color.DarkGrey,
                          fontSize: fontXSmall16,
                          fontFamily: 'Montserrat-Medium',
                        }}
                        onPress={() =>
                          navigate(Routes.Conclusion_Accepted, {
                            isLastMilestone:
                              milestones[this.state.currentIndex]
                                .isLastMilestone,
                            milestoneDetails:
                              milestones[this.state.currentIndex],
                            nextML: {},
                            jobDetails: this.state.jobDetails,
                          })
                        }
                      />
                    </View>
                  )}

                {milestones.length > 0 &&
                  this.isFailedPayment(milestones[this.state.currentIndex]) !==
                  undefined && (
                    <View>
                      {milestones.length > 0 &&
                        this.isFailedPayment(
                          milestones[this.state.currentIndex],
                        ) === true && (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginTop: 10,
                            }}>
                            <KMButton
                              title={'Retry Payment'}
                              onPress={() =>
                                this.onEscrowMilestone(
                                  milestones[this.state.currentIndex],
                                )
                              }
                              style={[
                                styles.button,
                                {
                                  width: width - 32,
                                  marginLeft: 16,
                                  alignSelf: 'center',
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
                      {milestones.length > 0 &&
                        this.isFailedPayment(
                          milestones[this.state.currentIndex],
                        ) === false && (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginTop: 10,
                            }}>
                            <KMButton
                              title={'Make Payment'}
                              onPress={() =>
                                this.onEscrowMilestone(
                                  milestones[this.state.currentIndex],
                                )
                              }
                              style={[
                                styles.button,
                                {
                                  width: width - 32,
                                  marginLeft: 16,
                                  alignSelf: 'center',
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
                {/* {milestones.length > 0 && (this.isPartialPayment(milestones[this.state.currentIndex]) === true && milestones[this.state.currentIndex].nMilestoneNumber !== 1) &&
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: 10, }}>
                                    <KMButton
                                        disabled={this.state.timerValue > 0}
                                        title={this.state.timerValue <= 0 ? 'Retry Payment' : `Retry Payment in ${this.state.timerValue} seconds`}
                                        onPress={() => this.initiateOnlineTransfer(milestones[this.state.currentIndex])}
                                        style={[styles.button, { width: width - 32, marginLeft: 16, alignSelf: "center", backgroundColor: this.state.timerValue <= 0 ? Color.GreyButton : Color.LightBlue, color: Color.WHITE }]} textStyle={{ color: Color.WHITE, fontSize: fontXSmall16, fontFamily: 'Montserrat-Medium' }} />
                                </View>
                            } */}
                {milestones.length > 0 &&
                  (!Globals.isBuilder &&
                    milestones[this.state.currentIndex].nMilestoneStatus ===
                    MilestoneStatus.WORK_REVIEW_REQUEST) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <KMButton
                        title={'Release Payment'}
                        onPress={() =>
                          this.onApproveMilestone(
                            milestones[this.state.currentIndex],
                            this.state.currentIndex,
                          )
                        }
                        style={[
                          styles.button,
                          {
                            width: width - 32,
                            marginLeft: 16,
                            alignSelf: 'center',
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

                {milestones.length > 0 &&
                  (Globals.isBuilder &&
                    milestones[this.state.currentIndex].payment_status === 4 &&
                    milestones[this.state.currentIndex].payment_reminder ===
                    false) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <KMButton
                        title={'Prompt Client to Fund Deposit Box'}
                        onPress={() =>
                          this.reminderForPayment(
                            milestones[this.state.currentIndex],
                          )
                        }
                        style={[
                          styles.button,
                          {
                            width: width - 32,
                            marginLeft: 16,
                            alignSelf: 'center',
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

                {/* button for others  */}

                {/* builder */}

                {milestones.length > 0 &&
                  (Globals.isBuilder &&
                    !contains(
                      [MilestoneStatus.PENDING, MilestoneStatus.ACCEPTED],
                      milestones[this.state.currentIndex].nMilestoneStatus,
                    )) && (
                    <View>
                      <ListButton
                        onPress={() =>
                          navigate(Routes.Work_Progress_List, {
                            milestoneId:
                              milestones[this.state.currentIndex]._id,
                            jobId: this.state.jobDetails._id,
                            type: 0,
                            jobDetails: this.state.jobDetails,
                            milestone: milestones[this.state.currentIndex],
                          })
                        }
                        Title="Building Issues"
                      />

                      {milestones[this.state.currentIndex].rejectComments &&
                        milestones[this.state.currentIndex].rejectComments
                          .length != 0 && (
                          <ListButton
                            onPress={() =>
                              navigate(Routes.Milestone_Rejection_Comments, {
                                milestoneDetails:
                                  milestones[this.state.currentIndex],
                              })
                            }
                            Title="Further Action Requested"
                            showNewView={
                              milestones[this.state.currentIndex]
                                .newRejectComment
                            }
                          />
                        )}
                      <ListButton
                        onPress={() =>
                          navigate(Routes.Work_Progress_List, {
                            milestoneId:
                              milestones[this.state.currentIndex]._id,
                            jobId: this.state.jobDetails._id,
                            type: 1,
                            jobDetails: this.state.jobDetails,
                            milestone: milestones[this.state.currentIndex],
                          })
                        }
                        Title="Work Progress"
                      />

                      {contains(
                        showReviewRequest,
                        milestones[this.state.currentIndex].nMilestoneStatus,
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

                {/* Client */}

                {milestones.length > 0 &&
                  (!Globals.isBuilder &&
                    !contains(
                      [MilestoneStatus.PENDING, MilestoneStatus.ACCEPTED],
                      milestones[this.state.currentIndex].nMilestoneStatus,
                    )) && (
                    <View>
                      {milestones[this.state.currentIndex].nMilestoneStatus ===
                        MilestoneStatus.WORK_REVIEW_REQUEST && (
                          <ListButton
                            onPress={() =>
                              navigate(Routes.Reject_Work, {
                                milestoneDetails:
                                  milestones[this.state.currentIndex],
                                onGoBack: result =>
                                  result &&
                                  this.setState({
                                    milestoneDetails: result,
                                  }),
                              })
                            }
                            Title="Request Tradesperson Action"
                            info="Raising an issue with work without creating a dispute may delay payment"
                          />
                        )}

                      <ListButton
                        onPress={() =>
                          navigate(Routes.Work_Progress_List, {
                            milestoneId:
                              milestones[this.state.currentIndex]._id,
                            jobId: this.state.jobDetails._id,
                            type: 0,
                            jobDetails: this.state.jobDetails,
                            milestone: milestones[this.state.currentIndex],
                          })
                        }
                        Title="Building Issues"
                      />
                      <ListButton
                        onPress={() =>
                          navigate(Routes.Work_Progress_List, {
                            milestoneId:
                              milestones[this.state.currentIndex]._id,
                            jobId: this.state.jobDetails._id,
                            type: 1,
                            jobDetails: this.state.jobDetails,
                            milestone: milestones[this.state.currentIndex],
                          })
                        }
                        Title="Work Progress"
                      />
                      {contains(
                        showReviewRequest,
                        milestones[this.state.currentIndex].nMilestoneStatus,
                      ) && (
                          <ListButton
                            // info={"If you cannot resolve an issue with your Tradesperson, request to open a formal dispute"}
                            toolTipPosition={'top'}
                            onPress={() => this.onRaiseDispute()}
                            Title="Raise Dispute"
                          />
                        )}
                      {milestones[this.state.currentIndex].rejectComments &&
                        milestones[this.state.currentIndex].rejectComments
                          .length != 0 && (
                          <ListButton
                            onPress={() =>
                              navigate(Routes.Milestone_Rejection_Comments, {
                                milestoneDetails:
                                  milestones[this.state.currentIndex],
                              })
                            }
                            Title="Payment Stage Further Action Requested"
                          />
                        )}
                    </View>
                  )}

                {/* {milestones.length > 0 && <SwipeListView
                                data={milestones}
                                renderItem={({ item, index }) =>
                                    this.renderMilestone(item, index)
                                }
                                renderHiddenItem={(data) => (
                                    <View>
                                    </View>
                                )}
                                rightOpenValue={Globals.isBuilder ? -200 : 0}
                            />} */}

                {/* {milestones.length > 0 &&
                                <View style={{ width: '90%', marginTop: 10, alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Label fontSize_14 Montserrat_Bold mb={18}>Total</Label>
                                    <Label fontSize_14 mb={18}>{milestoneTotal}</Label>
                                </View>
                            }
                            {Globals.isBuilder && milestones.length == 0 && bottomButtonType == bottomButton.ADD_ML &&
                                <TouchableOpacity onPress={() => navigate(Routes.Milestone_Listing, { jobId: jobDetails._id, jobAmount: jobDetails.nJobAmount, milestonePendingAmount: this.state.pendingAmount })} disabled={milestones.length <= 0} style={{ paddingLeft: 16, paddingRight: 16, }}>
                                    <Label fontSize_14 Montserrat_Medium color={(milestones.length > 0) ? Color.LightBlue : Color.Grey}>{"No Payment Stage found"}</Label>
                                </TouchableOpacity>} */}
              </View>
            )}
          </KeyboardAwareScrollView>
        </SafeAreaView>
        {milestoneTotal != 0 && milestoneTotal != jobDetails.nJobAmount && (
          <Label
            fontSize_14
            Montserrat_Medium
            color={Color.Red}
            style={{
              paddingLeft: 12,
              paddingRight: 12,
            }}
            mb={8}>
            {ErrorMessage.addMilestoneWarning}
          </Label>
        )}
        <ToastMessage
          successIconCustom={{
            fontSize: fontLarge24,
          }}
          massageTextCustom={{
            fontSize: fontXSmall16,
            lineHeight: 24,
            width: '90%',
          }}
          message={toast.message}
          mainViewCustom={{alignItems: 'center'}}
          isVisible={toast.show}
        />
        <View style={{flexDirection: 'row'}}>
          {/* {Globals.isBuilder &&
                        <KMButton
                            fontSize_16 Montserrat_Medium
                            color={Color.BLACK}
                            title="VIEW MODIFICATION REQUEST"
                            textStyle={{ padding: 0 }}
                            style={[GlobalStyles.bottomButtonStyle, { borderRadius: 0, alignItems: 'center', justifyContent: 'center', }]}
                            onPress={() => navigate(Routes.Contract_Modification_Requests)}
                        />
                    } */}

          {Globals.isBuilder &&
            (bottomButtonType == bottomButton.ACCEPT_JOB ||
              bottomButtonType == bottomButton.ADD_ML ||
              bottomButtonType == bottomButton.SUBMIT ||
              bottomButtonType == bottomButton.RESEND) && (
              <KMButton
                fontSize_16
                Montserrat_Medium
                color={Color.BLACK}
                title={this.getBottomBtnTitle()}
                textStyle={{padding: 0}}
                style={[
                  GlobalStyles.bottomButtonStyle,
                  {
                    borderRadius: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
                onPress={() => this.onBottomButtonClicked()}
              />
            )}

          {/* {Globals.isClient && jobDetails.nStatus === JobStatus.ACCEPTED && <KMButton
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title={'Make Payment'}
                        textStyle={{ padding: 0 }}
                        style={[GlobalStyles.bottomButtonStyle, { borderRadius: 0, alignItems: 'center', justifyContent: 'center', }]}
                        onPress={() => this.onAcceptMilestones()}
                    />} */}
          {/* {this.isPartialPayment(jobDetails?.ActiveMilestone) && <KMButton
                        disabled={this.state.timerValue > 0}
                        fontSize_16 Montserrat_Medium
                        color={Color.BLACK}
                        title={this.state.timerValue <= 0 ? 'Retry Payment' : `Retry Payment in ${this.state.timerValue} seconds`}
                        textStyle={{ padding: 0 }}
                        style={[GlobalStyles.bottomButtonStyle, { borderRadius: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: this.state.timerValue <= 0 ? Color.Yellow : Color.Grey }]}
                        onPress={() => this.initiateOnlineTransfer(jobDetails?.ActiveMilestone)}
                    />} */}
          {!Globals.isBuilder && (
            <View>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  // Alert.alert('Modal has been closed.');
                  this.setState({
                    modalVisible: false,
                  });
                }}>
                <View style={styles.seeAllBox}>
                  <TouchableOpacity
                    style={styles.arrowDownBtn}
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <CustomIcon
                      name={'arrowdown'}
                      style={{
                        fontSize: fontLarge24,
                        color: Color.LightBlue,
                      }}
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
                      <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <KMButton
                  title={'Reject Proposal'}
                  onPress={async () =>                
                    await this.onRejectButtonClick()
                  }
                  style={[
                    styles.button,
                    {
                      width: width - 32,
                      alignSelf: 'center',
                      backgroundColor: Color.Red,
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
                    </View>
                  </KeyboardAwareScrollView>
                </View>
              </Modal>
            </View>
          )}
          {showAccept && (
            <KMButton
              fontSize_16
              Montserrat_Medium
              color={Color.DarkGrey}
              title="Accept Proposal"
              textStyle={{padding: 0}}
              style={[
                GlobalStyles.bottomButtonStyle,
                {
                  borderRadius: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'flex-end',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: -1,
                  },
                  shadowOpacity: 0.09,
                  shadowRadius: 5,
                  elevation: 5,
                  backgroundColor: Color.WHITE,
                },
              ]}
              onPress={() => {
                this.setModalVisible(true);
              }}>
              <CustomIcon
                name={'arrowup'}
                style={{
                  fontSize: fontLarge24,
                  color: Color.LightBlue,
                }}
              />
            </KMButton>
          )}
        </View>
        {isLoading && <ProgressHud />}

        {this.state.milestones.length > 0 &&
          contains(
            [
              MilestoneStatus.ON_GOING,
              MilestoneStatus.WORK_REVIEW_REQUEST,
              MilestoneStatus.COMPLETED,
              MilestoneStatus.DISPUTE,
            ],
            this.state.milestones[this.state.currentIndex].nMilestoneStatus,
          ) && (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(Routes.Chat_View, {
                  jobDetails: this.state.jobDetails,
                  milestoneNumber: this.state.milestones[
                    this.state.currentIndex
                  ].nMilestoneNumber,
                });
              }}
              style={{
                position: 'absolute',
                bottom: isIphoneX() ? 40 : 20,
                backgroundColor: Color.DarkBlue,
                width: 60,
                height: 60,
                borderRadius: 30,
                right: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{width: 30, height: 30}}
                source={require('./../../../assets/Images/payment/icon_chat.png')}
              />
            </TouchableOpacity>
          )}

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
          jobTitle={milestoneTitle}
          escrow={this.state.escrow}
          nextMilestone={this.state.nextMilestone}
          openUrl={openUrl}
          onVerificationSuccess={() => {
            if (!this.state.isClose) {
              this.getJobDetails();
              this.setState({openUrl: ''});
              this.state.onVerificationSuccess();
            }
          }}
          onClose={() => {
            this.setState({
              isClose: true
            })
            this.getInitials()
          }}
          bankwireModal={bankwireModal}
        />
        <PaymentDetailModal
          milestoneStatus={milestoneStatus}
          milestoneAmount={milestoneAmount}
          paymentDetails={paymentDetails}
          show={this.state.showPaymentDetailModal}
          onClose={() =>
            this.setState({
              showPaymentDetailModal: false,
            })
          }
        />
      </View>
    );
  }

  getBottomBtnTitle() {
    let {bottomButtonType} = this.state;
    switch (bottomButtonType) {
      case bottomButton.ACCEPT_JOB:
        return 'ACCEPT JOB';
      case bottomButton.ADD_ML:
        return 'Add Payment Stage';
      case bottomButton.SUBMIT:
        return 'SUBMIT JOB PROPOSAL';
      // case bottomButton.MAKE_PAYMENT:
      //     return "Make Payment"      
      case bottomButton.RESEND:
        return 'RESEND JOB PROPOSAL';
      default:
        break;
    }
  }

  onDeleteMilestone = async () => {
    const {screenProps} = this.props;
    if (!screenProps.isConnected) {
      return;
    }

    this.setState({isLoading: true});

    try {
      let request = {
        milestoneId: this.state.deleteMilestoneId,
      };

      console.log('params', request);
      let response = await API.deleteMilestone(request);
      this.setState({isLoading: false});
      console.log('deleteMilestone response', response.data);
      screenProps.callback(response);
      if (response.status) {
        this.setState({
          bottomButtonType: bottomButton.ADD_ML,
        });
        this.getJobDetails();
      }
    } catch (error) {
      console.log('deleteMilestone error', error.message);
      this.setState({isLoading: false});
    }
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  onBottomButtonClicked = () => {
    switch (this.state.bottomButtonType) {
      case bottomButton.ACCEPT_JOB: {
        this.onFinalAcceptRejctJob(1);
        break;
      }
      case bottomButton.ADD_ML: {
        this.onAddMilestoneClick();
        break;
      }
      case bottomButton.SUBMIT: {
        this.setState({
          showConfirm: true,
          confirmMsg: 'Are you sure you want to submit this job proposal?',
          confirmFnc: () => this.onSubmitClick(),
          hideFnc: () => this.setState({showConfirm: false}),
        });
        // this.onSubmitClick()
        break;
      }
      case bottomButton.RESEND: {
        this.setState({
          showConfirm: true,
          confirmMsg: 'Are you sure you want to submit this job proposal?',
          confirmFnc: () => this.onSubmitClick(),
          hideFnc: () => this.setState({showConfirm: false}),
        });
        // this.onSubmitClick()
        break;
      }
      // case bottomButton.MAKE_PAYMENT: {
      //     this.onAcceptMilestones()
      //     break;
      // }
    }
  };

  checkAcceptStatus(item) {
    // console.log("checkAcceptStatus", item)
    // console.log("checkAcceptStatus", this.state.user._UserRoleId)
    return Globals.isBuilder
      ? item.nAcceptBuilderStatus == 0 &&
      item.oCreatedBy != this.state.user.userId
      : item.nAcceptClientStatus == 0 &&
      item.oCreatedBy != this.state.user.userId;
  }
  showHideEditJob = () => {
    let oBuilderId = this.state.jobDetails.oBuilderId;
    let oCreatedBy = this.state.jobDetails.oCreatedBy;
    this.props.navigation.setParams({
      isEditJob: oBuilderId === oCreatedBy,
      onEditJobClick: this.onEditJobClick,
    });
  };

  onEditJobClick = () => {
    const {navigation} = this.props;
    const {navigate} = navigation;

    navigate({
      routeName: Routes.Create_New_Job,
      params: {
        jobDetails: this.state.jobDetails,
        isEdit: true,
      },
      key: Math.random().toString(),
    });
  };

  onToastShow = toastMessage => {
    console.log('toast', 'showing');
    this.setState({
      toast: {show: true, message: toastMessage},
    });
    setTimeout(
      function () {
        this.setState({
          toast: {show: false, message: ''},
        });
      }.bind(this),
      1000,
    );
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
  onSubmitClick = async () => {
    const {screenProps} = this.props;
    if (!screenProps.isConnected) {
      return;
    }

    this.setState({isLoading: true});

    try {
      let request = {
        jobId: this.state.jobDetails._id,
      };

      let response = await API.submitMilestone(request);
      this.setState({isLoading: false});
      console.log('submitMilestone response', response);
      if (response.status) {
        this.setState({
          isLoading: false,
          bottomButtonType: undefined,
        });
        this.getJobDetails();
      }
      this.onToastShow(response.msg);
    } catch (error) {
      console.log('submitMilestone error', error.message);
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

  onAddMilestoneClick = () => {
    const {navigation} = this.props;
    const {navigate} = navigation;
    console.log('this.state.jobDetails', this.state.jobDetails.nJobAmount);

    navigate(Routes.Add_Milestone, {
      jobDetails: this.state.jobDetails,
      pendingAmount: this.state.pendingAmount,
    });
  };

  renderViewMore(onPress) {
    return (
      <Label
        fontSize_14
        Montserrat_Medium
        color={Color.LightBlue}
        onPress={onPress}>
        Read More
      </Label>
    );
  }

  renderViewLess(onPress) {
    return (
      <Label
        fontSize_14
        Montserrat_Medium
        color={Color.LightBlue}
        onPress={onPress}>
        Read Less
      </Label>
    );
  }
}
