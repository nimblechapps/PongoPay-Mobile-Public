/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {SafeAreaView, View, TextInput} from 'react-native';
import Label from '../../components/Label';
import Color from '../../utils/color';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CheckBox from "react-native-check-box";

import ConfirmModal from '../../components/ConfirmModal';
import HeaderTitle from '../../components/Header/HeaderTitle';
import KMButton from '../../components/KMButton';
import TextField from '../../components/TextField';
import {
  validateCharacter,
  validatePhone,
  validateEmail,
  validateDecimal,
} from '../../utils/validation';

import {fontXSmall16, screenWidth, fontSmall14} from '../../utils/theme';
import {ErrorMessage} from '../../utils/message';
import CustomIcon from '../../components/CustomIcon';
import Globals, {getTwoDecimalString, getAdminComission, getPmComission} from './../../utils/Globals';
import GlobalStyles from '../../utils/GlobalStyles';
import {Routes} from '../../utils/Routes';
import InputMask from '../../components/InputMask';
import ProgressHud from '../../components/ProgressHud';
import API from '../../API';
import ToastMessage from '../../components/toastmessage';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import ToolTip from '../../components/Tooltip';

export default class AddMilestone extends Component {
  static navigationOptions = ({}) => {
    return {
      headerTitle: () => <HeaderTitle title={'Add Payment Stage'} />,
    };
  };

  constructor(props) {
    super(props);
    const {params = {}} = props.navigation.state;
    this.state = {
      isLoading: false,
      jobDetails: params.jobDetails,
      jobId: params.jobDetails ? params.jobDetails._id : '',
      pendingAmount: params.pendingAmount,
      createdByPm: params.jobDetails.PropertyManager || false,
      hasSingleML: false,
      plans: [],
      milestoneTitle: {
        value: '',
        message: '',
        isValid: false,
      },
      milestoneAmount: {
        value: '',
        message: '',
        isValid: false,
      },
      expectedDate: {
        value: '',
        message: '',
        isValid: false,
        dateObj: '',
      },
      milestoneDesc: '',
      toast: {show: false, message: ''},
      toolTip: false,
      adminComission: '0',
      builderAmount: '0',
      pmComission: '0',
      clientAmount: '0',
      showConfirmModal: false,
      
    };
  }
  handleClick = () => {
    this.setState({toolTip: !this.state.toolTip});
  };

  onChecked = () => {
    let {hasSingleML} = this.state
    this.setState({
      hasSingleML: !hasSingleML
    }, this.setSingleMLvalues)
  }

  componentDidMount() {
    this.getSubscriptionPlans()
  }

  async getSubscriptionPlans() {
    try {
      let response = await API.getSubscriptionPlans();
      this.setState({isLoading: false});
      console.log('subscription plan response', response);
      if (response.status) {
        this.setState({
          plans: response.data,
        });
      }
    } catch (error) {

    }
  }

  setSingleMLvalues = () => {
    let {jobDetails, hasSingleML, milestoneTitle, milestoneAmount, milestoneDesc} = this.state
    if (jobDetails && hasSingleML) {
      milestoneTitle['value'] = jobDetails.sJobTitle
      milestoneTitle['isValid'] = true
      milestoneTitle['message'] = ''
      milestoneAmount['value'] = jobDetails.nJobAmount
      milestoneAmount['isValid'] = true
      milestoneAmount['message'] = ''

      milestoneDesc = jobDetails.sJobDescription

      let adminComission = getAdminComission(jobDetails.nJobAmount, this.state.plans)

      let {createdByPm} = this.state
      let pmComission = 0;
      if (createdByPm) {
        let comission = jobDetails.nCommission || 0
        pmComission = getPmComission(jobDetails.nJobAmount, comission)
      }
      this.setState({
        milestoneAmount,
        adminComission: getTwoDecimalString(adminComission),
        pmComission: getTwoDecimalString(pmComission),
        clientAmount: getTwoDecimalString(jobDetails.nJobAmount),
        builderAmount: getTwoDecimalString((parseFloat(jobDetails.nJobAmount) - parseFloat(adminComission) - parseFloat(pmComission)))
      });



    } else {
      milestoneTitle['value'] = ''
      milestoneTitle['isValid'] = false
      milestoneAmount['value'] = ''
      milestoneAmount['isValid'] = false

      milestoneDesc = ''
    }
    this.setState({milestoneTitle, milestoneAmount, milestoneDesc})

  }

  render() {
    const {navigation} = this.props;
    const {navigate} = navigation;
    const {
      isLoading,
      milestoneTitle,
      milestoneAmount,
      milestoneDesc,
      pendingAmount,
      toast,
      expectedDate,
      hasSingleML
    } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeVStyle}>
          <KeyboardAwareScrollView>
            <View
              style={{
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 24,
                paddingBottom: 16,
              }}>
              <CheckBox
                style={styles.checkboxMain}
                onClick={() => this.onChecked()}
                checkedImage={<CustomIcon name="checked-box" style={styles.checkIcon} />}
                unCheckedImage={<CustomIcon name="unchecked-box" style={styles.checkIcon} />}
                isChecked={hasSingleML}
                rightText={'This job only has one payment stage'}
                rightTextStyle={{color: Color.black, fontFamily: "Montserrat-Regular", fontSize: fontSmall14, lineHeight: 24, paddingLeft: 15}}
              />
              <TextField style={{zIndex: -1}}
                LabelTitle="Title*"
                placeholder="e.g. Wind and Watertight"
                onChangeText={this.onMilestoneTitleChange}
                value={milestoneTitle.value}
                autoFocus={true}
                returnKeyType={'next'}
                onSubmitEditing={() => this.AmountInput.refs.AmountRef.focus()}>
                {milestoneTitle.message !== '' && (
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
                      {milestoneTitle.message}
                    </Label>
                  </View>
                )}
              </TextField>
              <View style={{zIndex: -10}}>

                <TextField
                  LabelTitle="Amount*"
                  keyboardType={'numeric'}
                  placeholder={
                    pendingAmount
                      ? 'Remaining job budget is £' + pendingAmount.toFixed(2).toString()
                      : 'Amount'
                  }
                  onFocus={this.getSubscriptionPlans.bind(this)}
                  onChangeText={this.onMilestoneAmountChange}
                  value={milestoneAmount.value}
                  ref={ref => (this.AmountInput = ref)}
                  reference="AmountRef"
                  returnKeyType={'next'}
                />
                {milestoneAmount.message !== '' && (
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
                      {milestoneAmount.message}
                    </Label>
                  </View>
                )}
              </View>

              {!hasSingleML && <View style={{zIndex: -12}}>
                <View style={styles.labelCss}>
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.DarkGrey}
                    style={{paddingRight: 8}}>
                    Charge to Client:
                  </Label>
                  <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey}>
                    £ {this.state.clientAmount}
                  </Label>
                </View>
                <View style={styles.labelCss}>
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.DarkGrey}
                    style={{paddingRight: 8}}>
                    Service Fee:
                  </Label>
                  <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey}>
                    £ {this.state.adminComission}
                  </Label>
                </View>
                {this.state.createdByPm && <View style={styles.labelCss}>
                  <Label
                    fontSize_14
                    Montserrat_Medium
                    color={Color.DarkGrey}
                    style={{paddingRight: 8}}>
                    Property Manager Commission :
                  </Label>
                  <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey}>
                    £ {this.state.pmComission}
                  </Label>
                </View>}
                <View style={{backgroundColor: Color.GreyLightColor, height: 1, top: 5}} ></View>
                <View style={styles.labelCss}>
                  <Label
                    fontSize_14
                    Montserrat_Bold
                    color={Color.DarkGrey}
                    style={{paddingRight: 8}}>
                    Amount You’ll Receive :
                  </Label>
                  <Label fontSize_16 Montserrat_Regular color={Color.DarkGrey}>
                    £ {this.state.builderAmount}
                  </Label>
                </View>
                <View style={{backgroundColor: Color.GreyLightColor, height: 1, }} ></View>
              </View>}

              <View style={{zIndex: -11}}>
                <View
                  style={{
                    paddingRight: 16,
                    paddingTop: 24,
                    marginBottom: 5,
                    borderBottomColor: Color.WhiteGrey,
                    flexDirection: 'row',
                    zIndex: 11,
                  }}>
                  <Label fontSize_16 color={Color.DarkGrey} mb={10}>
                    Expected Completion Date*{' '}
                  </Label>
                  <ToolTip
                    onClickPress={this.handleClick}
                    toolTip={this.state.toolTip}
                    title={
                      'Give a rough estimate of when you expect to complete this work'
                    }
                    customTriangle={{left: '78%'}}
                  />
                </View>

                <DatePicker
                  style={{
                    width: Globals.isIpad ? 400 : screenWidth - 30,
                    marginBottom: 20,
                  }}
                  date={expectedDate.value}
                  mode="date"
                  placeholder="DD-MM-YYYY"
                  format="DD-MM-YYYY"
                  minDate={new Date()}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      display: 'none',
                    },
                    dateText: {
                      fontSize: fontXSmall16,
                      color: Color.BLACK,
                      fontFamily: 'Montserrat-Regular',
                    },
                    placeholderText: {
                      fontFamily: 'Montserrat-Regular',
                      fontSize: fontXSmall16,
                    },
                    dateInput: {
                      marginLeft: 0,
                      borderRadius: 4,
                      height: 48,
                      alignItems: 'flex-start',
                      paddingLeft: 15,
                      paddingRight: 15,
                      borderColor: Color.LightGrey,
                      fontFamily: 'Montserrat-Regular',
                      fontSize: fontXSmall16,
                    },
                  }}
                  onDateChange={(date, dateObj) => {
                    console.log('date', moment(dateObj).format('MM-DD-YYYY'));
                    let {expectedDate} = this.state;
                    if (!date) {
                      expectedDate = {
                        value: '',
                        message: ErrorMessage.dateOfBirthRequired,
                        isValid: false,
                        dateObj: '',
                      };
                    } else {
                      expectedDate = {
                        value: moment(dateObj).format('DD-MM-YYYY'),
                        message: '',
                        isValid: true,
                        dateObj: dateObj,
                      };
                    }
                    this.setState(
                      {
                        expectedDate,
                      },
                      () => {
                        console.log(
                          'state Date',
                          moment(dateObj).format('YYYY-MM-DD'),
                        );
                      },
                    );
                  }}
                />

                {expectedDate.message != '' && (
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
                      style={{paddingLeft: 10, paddingRight: 10}}>
                      {expectedDate.message}
                    </Label>
                  </View>
                )}
              </View>

              <View style={{zIndex: -11}}>
                <TextField
                  multiline
                  LabelTitle="Description of Work"
                  placeholder="Outline the tasks that need to be completed for this payment to be released"
                  onChangeText={this.onMilestoneDescChange}
                  value={milestoneDesc}
                  isTooltip={true}
                  toolTipTitle={
                    'Outline all the work that must be done for this payment to be released. This is an important part of your agreement with the Client.'
                  }
                  customTriangle={{left: '49%'}}
                  returnKeyType={'done'}
                  customStyle={{
                    height: 96,
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                />
              </View>
              <ConfirmModal show={this.state.showConfirmModal}
                    onHide={() => this.setState({showConfirmModal: false})}
                    onConfirm={() => {
                        this.setState({showConfirmModal: false})
                        this.state.confirmFnc()
                    }}
                    msg={this.state.confirmMsg} />   
            
            
            
            </View>
            <ToastMessage
              isError={true}
              massageTextCustom={{
                fontSize: fontXSmall16,
                lineHeight: 24,
                width: '90%',
              }}
              message={toast.message}
              mainViewCustom={{alignItems: 'center'}}
              isVisible={toast.show}
            />
          </KeyboardAwareScrollView>
        </SafeAreaView>
        <KMButton
          fontSize_16
          Montserrat_Medium
          color={Color.BLACK}
          title="ADD"
          textStyle={{padding: 0}}
          style={[
            GlobalStyles.bottomButtonStyle,
            {
              backgroundColor: this.isSubmitDisable()
                ? Color.GreyLightColor
                : Color.Yellow,
            },
          ]}
          onPress={this.onMilestoneCheck}
          // onPress={() => navigate(Routes.Job_Details)}
          disabled={this.isSubmitDisable()}
        />
        {isLoading && <ProgressHud />}
      </View>
    );
  }

  onMilestoneTitleChange = text => {
    const milestoneTitle = this.state.milestoneTitle;
    milestoneTitle.value = text;

    if (milestoneTitle.value.length == 0 || milestoneTitle.value == '') {
      milestoneTitle.message = ErrorMessage.milestoneTitleRequired;
      milestoneTitle.isValid = false;
    } else {
      milestoneTitle.message = '';
      milestoneTitle.isValid = true;
    }
    this.setState({
      milestoneTitle,
    });
  };

  onMilestoneAmountChange = text => {
    const milestoneAmount = this.state.milestoneAmount;
    milestoneAmount.value = text.trim();

    // if(milestoneAmount.value.includes(".") ){
    //   milestoneAmount.value = text.trim().replace(".","");
    // }
    if (
      milestoneAmount.value.length == 0 ||
      milestoneAmount.value == '' ||
      milestoneAmount.value == 0
    ) {
      milestoneAmount.message = ErrorMessage.milestoneAmountRequired;
      milestoneAmount.isValid = false;
    } else if (!validateDecimal(milestoneAmount.value)) {
      milestoneAmount.message = 'Invalid value';
      milestoneAmount.isValid = false;
    } else if (milestoneAmount.value > this.state.pendingAmount) {
      milestoneAmount.message = ErrorMessage.milestoneAmountExceed;
      milestoneAmount.isValid = false;
    } else {
      milestoneAmount.message = '';
      milestoneAmount.isValid = true;
    }
    let adminComission = getAdminComission(milestoneAmount.value, this.state.plans)
    let {pmComission, jobDetails, createdByPm} = this.state
    if (createdByPm) {
      let comission = jobDetails.PropertyManager.nCommission || 0
      pmComission = getPmComission(milestoneAmount.value, comission)
    }
    this.setState({
      milestoneAmount,
      adminComission: getTwoDecimalString(adminComission),
      pmComission: getTwoDecimalString(pmComission),
      clientAmount: getTwoDecimalString(milestoneAmount.value),
      builderAmount: getTwoDecimalString((parseFloat(milestoneAmount.value) - parseFloat(adminComission) - parseFloat(pmComission)))
    });
  };

  onMilestoneDescChange = text => {
    this.setState({
      milestoneDesc: text,
    });
  };

  isSubmitDisable() {
    return (
      !this.state.milestoneTitle.isValid ||
      !this.state.milestoneAmount.isValid ||
      !this.state.expectedDate.isValid
    );
  }

  onMilestoneCheck = async () => {
    let {expectedDate} = this.state;
    let today = moment(new Date()).format('DD-MM-YYYY');
    if (today === expectedDate.value) {
      this.setState({
        showConfirmModal: true,
        confirmMsg: 'Warning: Sending a job proposal on the same day as expected completion is likely to result in delayed payment',
        confirmFnc: () => this.onAddMilestoneClick(),
        hideFnc: () => this.setState({showConfirmModal: false})
      })
    } else {
      this.onAddMilestoneClick();
    }
  }

  onAddMilestoneClick = async () => {
    const {navigation, screenProps} = this.props;
    const {navigate} = navigation;
    if (!screenProps.isConnected) {
      return;
    }

    //this.setState({isLoading: true});
    const {
      jobId,
      milestoneTitle,
      milestoneAmount,
      milestoneDesc,
      expectedDate,
      adminComission,
      builderAmount,
      pmComission,
    } = this.state;

    let date = moment(expectedDate.dateObj).format('YYYY-MM-DD');
    console.log('Date in api ', date);
    try {
      let request = {
        jobId: jobId,
        milestoneTitle: milestoneTitle.value,
        milestoneAmount: milestoneAmount.value,
        expectedCompletionDate: date,
        milestoneDesc,
        adminComission,
        builderAmount,
        pmComission,
      };

      let response = await API.createMilestone(request);
      this.setState({isLoading: false});
      console.log('createMilestone response', response);
      if (response.status) {
        navigate(Routes.Job_Details);
      } else {
        //show toast
        this.setState({toast: {show: true, message: response.msg}});
        setTimeout(
          function () {
            this.setState({toast: {show: false, message: ''}});
          }.bind(this),
          1000,
        );
      }
    } catch (error) {
      console.log('createMilestone error', error.message);
      this.setState({isLoading: false});
    }
  };
}

